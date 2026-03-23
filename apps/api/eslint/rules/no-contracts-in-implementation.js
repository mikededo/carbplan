const CONTRACTS_PREFIX = '@carbplan/contracts'

const isContractsImport = (sourceValue) => typeof sourceValue === 'string' &&
  (sourceValue === CONTRACTS_PREFIX || sourceValue.startsWith(`${CONTRACTS_PREFIX}/`))

const reportIfContractsImport = (context, sourceNode) => {
  if (!sourceNode || sourceNode.type !== 'Literal') {
    return
  }

  if (!isContractsImport(sourceNode.value)) {
    return
  }

  context.report({
    messageId: 'forbiddenContractsImport',
    node: sourceNode
  })
}

export default {
  create(context) {
    return {
      CallExpression(node) {
        if (node.callee.type !== 'Identifier' || node.callee.name !== 'require') {
          return
        }

        const [sourceNode] = node.arguments
        reportIfContractsImport(context, sourceNode)
      },
      ExportAllDeclaration(node) {
        reportIfContractsImport(context, node.source)
      },
      ExportNamedDeclaration(node) {
        reportIfContractsImport(context, node.source)
      },
      ImportDeclaration(node) {
        reportIfContractsImport(context, node.source)
      },
      ImportExpression(node) {
        reportIfContractsImport(context, node.source)
      }
    }
  },
  meta: {
    docs: {
      description: 'Disallow imports from @carbplan/contracts inside service/repository implementation files'
    },
    messages: {
      forbiddenContractsImport: 'Do not import @carbplan/contracts from service/repository files. Move contracts usage to the module boundary layer.'
    },
    schema: [],
    type: 'problem'
  }
}
