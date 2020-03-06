const { GraphQLServer } = require('graphql-yoga')

let links = [{
  id: 'link-0',
  url: 'www.howtographql.com',
  description: 'Fullstack tutorial for GraphQL'
}]

let idCount = links.length

const resolvers = {
  Query: {
    link: (_, {id}) => {
      return links.find(link => link.id === id)
    },
    links: () => links,
  },
  Mutation: {
    createLink: (root, args, context, info) => {
      const { input } = args
      const link = {
        id: `link-${idCount++}`,
        description: input.description,
        url: input.url,
        level: input.level
      }
      links.push(link)
      return link
    },
    updateLink: (root, {id, description, url, level}, context, info) => {
      links = links.map(link => {
        if(link.id === id){
          link.description = description ? description : link.description,
          link.url = url ? url : link.url ,
          link.level = level ? level : link.level
        }
        return link
      })
      return links.find(link => link.id === id)
    },
    deleteLink: (root, {id}, context, info) => {
      links = links.filter(link => link.id !== id)
      return 'Success'
    },
  },
  Link: {
    id: (parent) => parent.id,
    description: (parent) => parent.description,
    url: (parent) => parent.url,
    level: (parent) => parent.level
  }
}

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql', 
  resolvers,
})
server.start(() => console.log(`Server is running on http://localhost:4000`))