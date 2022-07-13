const { buildSubgraphSchema } = require("@apollo/subgraph");
const { gql } = require("apollo-server");
// const { graphql,graphqlSync,buildSchema,getIntrospectionQuery, GraphQLSchema, assertSchema,introspectionQuery } = require("graphql");
const  generateTSTypesAsString  = require("./src/index.ts").generateTSTypesAsString;
// const { makeExecutableSchema } = require("graphql-tools");

async function start(){
    const resolvers = {
        Query: {
          async bookmark(root, params, { models }, info) {
            return 'bookmarkService.getBookmark(root, params, models, info);'
          },
          async bookmarks(root, params, { models }, info) {
            return 'bookmarkService.getBookmarks(root, params, models, info);'
          },
          async collection(root, params, { models }) {
            return 'collectionService.getCollection(root, params, models);'
          },
          async collections(root, params, { models }) {
            return 'collectionService.getCollections(root, params, models);'
          },
      
          async allBookmarkcollections(root, args, { models }) {
            return 'bookmarkCollectionsService.getAllBookmarkcollections(root, params, models);'
          },
          async bookmarkcollection(root, params, { models }) {
            return 'bookmarkCollectionsService.bookmarkCollection(root, params, models);'
          },
        },
        Mutation: {
          async createBookmark(root, params, { models }) {
            return' bookmarkService.createBookmark(root, params, models);'
          },
          async createCollection(root, params, { models }) {
            return 'collectionService.createCollection(root, params, models);'
          },
          async createBookmarkcollection(root, params, { models }) {
            return 'bookmarkCollectionsService.createBookmarkCollection(root, params, models);'
          },
          async updateBookmark(root, params, { models }) {
            return 'bookmarkService.updateBookmark(root, params, models);'
          },
          async updateCollection(root, params, { models }) {
            return 'collectionService.updateCollection(root, params, models);'
          },
          async deleteCollection(root, params, { models }) {
            return 'collectionService.deleteCollection(root, params, models);'
          },
          async moveBookmarks(root, params, { models }) {
            return 'bookmarkCollectionsService.moveBookmarks(root, params, models);'
          },
        },
        Bookmark: {
          async totalCollectionCount(bookmark, args, models, info) {
            return 'bookmarkCollectionsService.totalCollectionCount(bookmark, args, models, info);'
          },
          async collections(bookmark, models) {
            return 'bookmarkService.getBookmarkCollections(bookmark);'
          },
          async content(bookmark, args, models, info) {
            const data = {
              __typename: bookmark.documentType,
              organizationId: bookmark.organizationId,
              id: bookmark.copilotId,
              amgUUID: bookmark.amgUUID
            }
            return data;
          },
          async story(bookmark, args, models, info) {
            const data = {
              __typename: 'Story',
              id: bookmark.copilotId
            }
            return data;
          },
          async comments(bookmark, args, models, info) {
            const data = {
              __typename: 'UEComment',
              id: bookmark.copilotId,
            }
            return data;
          },
          async ratings(bookmark, args, models, info) {
            const data = {
              __typename: 'UERating',
              id: bookmark.copilotId,
              organizationId: bookmark.organizationId,
            }
            return data;
          }
        },
        Collection: {
          async totalBookmarkCount(collection, args, models, info) {
            return 'bookmarkCollectionsService.totalBookmarkCount(collection, args, models, info);'
          },
          async lastBookmark(collection, args, models, info) {
            return 'bookmarkCollectionsService.lastBookmark(collection, args, models, info);'
          },
          async bookmarks(collection) {
            return 'collectionService.getBookmarkCollections(collection);'
          },
        },
        Bookmarkcollection: {
          async bookmark(bookmarkcollection) {
            return' bookmarkCollectionsService.getBookmark(bookmarkcollection);'
          },
          async collection(bookmarkcollection) {
            return' bookmarkCollectionsService.getCollection(bookmarkcollection);'
          },
        },
        Article:{ 
          async bookmark(obj) {
            return ' bookmarkService.getBookmarkByUser(obj);'
          },
          async isBookmarked(object,args) {
            return 'bookmarkService.getIsBookmarked(object,args);'
          },
        },
        Photo:{
          async isBookmarked(object,args) {
            return 'bookmarkService.getIsBookmarked(object,args);'
          }
        },
        Gallery:{
          async isBookmarked(object,args) {
            return 'bookmarkService.getIsBookmarked(object,args);'
          }
        },
        Recipe:{
          async isBookmarked(object,args) {
            return 'bookmarkService.getIsBookmarked(object,args);'
          }
        }
      };

      const typeDefs =gql`
      directive @link(
        url: String, 
        import: [String]
      ) repeatable on SCHEMA
  extend schema  @link(url: "https://specs.apollo.dev/federation/v2.0", import: ["@key", "@shareable", "@external"])

  type Bookmark {
    id: Int!
    organizationId: String
    copilotId:String
    siteCode:String
    documentUrl: String
    bookmarkName: String
    documentType: String
    meta: String
    amgUUID: String!
    collections: [Bookmarkcollection!]!
    totalCollectionCount:Int
    content: DocumentType
  }

  union DocumentType = Article | Photo | Gallery | Recipe

  type Article @key(fields: "id organizationId") {
    id: ID! @external
    organizationId: ID! @external
    isBookmarked(amgUUID: ID!): Boolean
  }

  type Photo @key(fields: "id organizationId") {
    id: ID!
    organizationId: ID!
    isBookmarked(amgUUID: ID!): Boolean
  }

  type Gallery @key(fields: "id organizationId") {
    id: ID!
    organizationId: ID!
    isBookmarked(amgUUID: ID!): Boolean
  }

  type Recipe @key(fields: "id organizationId") {
    id: ID!
    organizationId: ID!
    isBookmarked(amgUUID: ID!): Boolean
  }

  type Story @key(fields: "id") {
    id: ID!
  }

  type Collection {
    id: Int!
    collectionName: String!
    amgUUID: String!
    organizationId: String!
    bookmarks: [Bookmarkcollection!]!
    totalBookmarkCount:Int
    lastBookmark:Bookmark
  }

  type Bookmarkcollection {
    id: Int
    bookmark: Bookmark
    collection: Collection
  }




  type Message{
      message:String
  }

  type Mutation {
    createBookmark(bookmarkName: String!, amgUUID: String!, organizationId: String!, copilotId: String!, siteCode:String,documentType:String): Bookmark!
    createCollection(collectionName: String!, amgUUID: String!,organizationId: String!, copilotIds:[String],bookmarkIds:[Int]): Collection!
    createBookmarkcollection(bookmarkId: Int!, collectionId: Int!): Bookmarkcollection!
    updateBookmark(id:Int!,bookmarkName: String, amgUUID: String, organizationId: String, siteCode:String): Bookmark!
    updateCollection(id:Int!,collectionName: String, amgUUID: String, organizationId: String, copilotIds:[String], bookmarkIds:[Int],addCopilotIds:[String],removeCopilotIds:[String],addBookmarkIds:[Int],removeBookmarkIds:[Int]): Collection!
    deleteCollection(id:Int!):Message
    moveBookmarks(fromCollectionId:Int!,toCollectionId:Int!,copilotIds:[String],bookmarkIds:[Int],moveAll:Boolean):Message
  }
`
const sschema = buildSubgraphSchema({ resolvers, typeDefs })
// console.log(sschema,"sschema")
// console.log(sschema instanceof GraphQLSchema,"off")


// const sdlSchema = `
//   type Author {
//     firstName: String
//     lastName: String
//   }
//   type Query {
//     author(id: Int!): Author
//   }
  
// `;

// // const graphqlSchemaObj = buildSchema(sdlSchema);
// const graphqlSchemaObj = makeExecutableSchema({
//     typeDefs: sdlSchema,
//     resolvers: {
//       Query: {
//         author: () => ({ firstName: "Ada", lastName: "Lovelace" })
//       }
//     }
//   });
// // console.log(assertSchema(sschema))
// console.log(sschema,"sschema")
const str = `
    type Hello{
        name: String
    }
    `
const types = await generateTSTypesAsString(sschema, 'hello.graphql', {
  tabSpaces: 2,
  typePrefix: "graphql",
  strictNulls: true
});
console.log(types,"types")
// const { data, errors } = await graphql(sschema, getIntrospectionQuery());

// console.log(data,"data")
// if(errors){
//     console.log(errors,"errors")
// }
const sdlString = `
  type Query {
    hello: String
  }
`;

// const graphqlSchemaObj2 = buildSchema(sdlString);
// console.log(graphqlSchemaObj2,"graphqlSchemaObj2")
// const result = await graphql(graphqlSchemaObj2, getIntrospectionQuery());
// console.log(result,"re")
// console.log(result.data,"re")
}


start()