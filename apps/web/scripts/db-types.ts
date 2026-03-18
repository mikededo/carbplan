import { $ } from 'bun'
import process from 'node:process'
import ts from 'typescript'

const OUTPUT_PATH = './src/lib/database/types.g.ts'

const SPINNER_FRAMES = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏']
const COLORS = {
  cyan: '\x1B[36m',
  dim: '\x1B[2m',
  green: '\x1B[32m',
  reset: '\x1B[0m',
  yellow: '\x1B[33m'
}

const spinner = {
  frame: 0,
  interval: null as null | Timer,
  start(message: string) {
    this.frame = 0
    process.stdout.write(`${COLORS.cyan}${SPINNER_FRAMES[0]}${COLORS.reset} ${message}`)
    this.interval = setInterval(() => {
      this.frame = (this.frame + 1) % SPINNER_FRAMES.length
      process.stdout.write(`\r${COLORS.cyan}${SPINNER_FRAMES[this.frame]}${COLORS.reset} ${message}`)
    }, 80)
  },
  stop(success = true) {
    if (this.interval) {
      clearInterval(this.interval)
      this.interval = null
    }
    const icon = success ? `${COLORS.green}✓${COLORS.reset}` : `${COLORS.yellow}✗${COLORS.reset}`
    process.stdout.write(`\r${icon}\n`)
  }
}

const singularize = (word: string): string => {
  if (word.endsWith('ies')) {
    return `${word.slice(0, -3)}y`
  }
  if (word.endsWith('ses') || word.endsWith('xes') || word.endsWith('zes') || word.endsWith('ches') || word.endsWith('shes')) {
    return word.slice(0, -2)
  }
  if (word.endsWith('s') && !word.endsWith('ss')) {
    return word.slice(0, -1)
  }
  return word
}

const snakeToPascal = (str: string): string =>
  str
    .split('_')
    .map((word) => singularize(word))
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('')

type EnumDefinition = {
  name: string
  values: string[]
}

type ExtractedEntities = {
  enums: EnumDefinition[]
  tables: string[]
  views: string[]
}

const getPropertyKeys = (node: ts.TypeLiteralNode, propertyName: string): string[] => {
  const member = node.members.find((m) => {
    if (!ts.isPropertySignature(m) || !m.name) {
      return false
    }
    const name = ts.isIdentifier(m.name) ? m.name.text : ''
    return name === propertyName && m.type && ts.isTypeLiteralNode(m.type)
  }) as ts.PropertySignature | undefined

  if (!member?.type || !ts.isTypeLiteralNode(member.type)) {
    return []
  }

  return member.type.members
    .filter((m): m is ts.PropertySignature => ts.isPropertySignature(m) && !!m.name)
    .map((m) => ts.isIdentifier(m.name!) ? m.name!.text : '')
    .filter((n) => n && n !== '_')
}

const extractEnumValues = (sourceFile: ts.SourceFile): Map<string, string[]> => {
  const enumValues = new Map<string, string[]>()

  const visit = (node: ts.Node) => {
    ts.forEachChild(node, visit)

    if (!ts.isVariableStatement(node) || node.declarationList.declarations.length === 0) {
      return
    }

    const decl = node.declarationList.declarations[0]
    const isConstantsDecl = ts.isIdentifier(decl.name) &&
      decl.name.text === 'Constants' &&
      decl.initializer &&
      ts.isAsExpression(decl.initializer) &&
      ts.isObjectLiteralExpression(decl.initializer.expression)

    if (!isConstantsDecl) {
      return
    }

    const constantsObj = (decl.initializer as ts.AsExpression).expression as ts.ObjectLiteralExpression
    constantsObj.properties.forEach((prop) => {
      if (!ts.isPropertyAssignment(prop) || !ts.isIdentifier(prop.name) || prop.name.text !== 'public') {
        return
      }
      if (!ts.isObjectLiteralExpression(prop.initializer)) {
        return
      }

      prop.initializer.properties.forEach((publicProp) => {
        if (!ts.isPropertyAssignment(publicProp) || !ts.isIdentifier(publicProp.name) || publicProp.name.text !== 'Enums') {
          return
        }
        if (!ts.isObjectLiteralExpression(publicProp.initializer)) {
          return
        }

        publicProp.initializer.properties.forEach((enumProp) => {
          if (!ts.isPropertyAssignment(enumProp) || !ts.isIdentifier(enumProp.name)) {
            return
          }
          if (!ts.isArrayLiteralExpression(enumProp.initializer)) {
            return
          }

          const values = enumProp.initializer.elements.reduce((acc: string[], element) => {
            if (!ts.isStringLiteral(element)) {
              return acc
            }

            return [...acc, element.text]
          }, [])
          enumValues.set(enumProp.name.text, values)
        })
      })
    })
  }

  visit(sourceFile)
  return enumValues
}

const extractEntities = (content: string): ExtractedEntities => {
  const sourceFile = ts.createSourceFile('types.ts', content, ts.ScriptTarget.Latest, true)
  const tables: string[] = []
  const views: string[] = []
  const enumNames: string[] = []

  const visit = (node: ts.Node) => {
    const shouldProcessNode = ts.isTypeAliasDeclaration(node) &&
      node.name.text === 'Database' &&
      ts.isTypeLiteralNode(node.type)

    if (shouldProcessNode) {
      node.type.members.forEach((member) => {
        if (!ts.isPropertySignature(member) || !member.name || !ts.isIdentifier(member.name)) {
          return
        }
        if (member.name.text !== 'public' || !member.type || !ts.isTypeLiteralNode(member.type)) {
          return
        }

        tables.push(...getPropertyKeys(member.type, 'Tables'))
        views.push(...getPropertyKeys(member.type, 'Views'))
        enumNames.push(...getPropertyKeys(member.type, 'Enums'))
      })
    }
    ts.forEachChild(node, visit)
  }

  visit(sourceFile)

  const enumValuesMap = extractEnumValues(sourceFile)
  const enums: EnumDefinition[] = enumNames.map((name) => ({
    name,
    values: enumValuesMap.get(name) ?? []
  }))

  return { enums, tables, views }
}

const snakeToPascalKey = (str: string): string =>
  str
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('')

const generateEnumCode = ({ name, values }: EnumDefinition): string[] => {
  const pascalName = snakeToPascal(name)
  const enumMembers = values
    .map((value) => `  ${snakeToPascalKey(value)} = '${value}'`)
    .join(',\n')
  const valuesArray = values.map((v) => `'${v}'`).join(', ')

  return [
    `export enum ${pascalName} {\n${enumMembers}\n}`,
    `export const ${pascalName}Values = [${valuesArray}] as const`
  ]
}

const generateTableTypes = ({ enums, tables, views }: ExtractedEntities): string => {
  const lines: string[] = []

  tables.forEach((name) => {
    const pascalName = snakeToPascal(name)
    lines.push(
      `export type ${pascalName} = Tables<'${name}'>`,
      `export type ${pascalName}Insert = TablesInsert<'${name}'>`,
      `export type ${pascalName}Update = TablesUpdate<'${name}'>`,
      ''
    )
  })
  views.forEach((name) => {
    const pascalName = snakeToPascal(name)
    lines.push(`export type ${pascalName} = Tables<'${name}'>`, '')
  })
  enums.forEach((enumDef) => {
    lines.push(
      ...generateEnumCode(enumDef),
      `export type ${snakeToPascal(enumDef.name)}Type = Enums<'${enumDef.name}'>`,
      ''
    )
  })

  if (lines.length === 0) {
    return ''
  }

  return `\n/** Auto-generated table types */\n${lines.join('\n')}`
}

const main = async () => {
  console.log(`\n${COLORS.cyan}◆${COLORS.reset} Database Types Generator\n`)

  spinner.start('Fetching types from Supabase')
  await $`bunx supabase gen types --lang typescript --linked > ${OUTPUT_PATH}`.quiet()
  spinner.stop()

  spinner.start('Extracting entities')
  const content = await Bun.file(OUTPUT_PATH).text()
  const entities = extractEntities(content)
  spinner.stop()

  console.log(`  ${COLORS.dim}├${COLORS.reset} Tables: ${COLORS.green}${entities.tables.map((t) => snakeToPascal(t)).join(', ')}${COLORS.reset}`)
  console.log(`  ${COLORS.dim}├${COLORS.reset} Views:  ${COLORS.green}${entities.views.map((v) => snakeToPascal(v)).join(', ')}${COLORS.reset}`)
  console.log(`  ${COLORS.dim}└${COLORS.reset} Enums:  ${COLORS.green}${entities.enums.map((e) => snakeToPascal(e.name)).join(', ')}${COLORS.reset}`)

  spinner.start('Generating types')
  const tableTypes = generateTableTypes(entities)
  const finalContent = content + tableTypes
  await Bun.write(OUTPUT_PATH, finalContent)
  spinner.stop()

  spinner.start('Formatting output')
  await $`bunx eslint ${OUTPUT_PATH} --fix`.quiet()
  spinner.stop()

  console.log(`\n${COLORS.green}✓${COLORS.reset} Generated ${COLORS.cyan}${entities.tables.length + entities.views.length}${COLORS.reset} types → ${COLORS.dim}${OUTPUT_PATH}${COLORS.reset}\n`)
}

main().catch(console.error)
