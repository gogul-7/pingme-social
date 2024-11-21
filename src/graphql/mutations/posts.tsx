export const EDIT_POST = `mutation EditPost(
    $id: Int!, 
    $caption: String!, 
    $tags: [String!]
  ) {
    updatepostsCollection(
      set: { 
        caption: $caption, 
        tagged_users: $tags
      },
      filter: {
        id: { eq: $id }
      }
    ) {
    affectedCount
      records {
        tagged_users
        caption
      }
      }
    }
  `;

export const CREATE_POST = `mutation CreatePost(
    $imageUrl: String!, 
    $userId: String!, 
    $caption: String!, 
    $tags: [String!]
  ) {
    insertIntopostsCollection(
      objects: [
        {
          image_url: $imageUrl,
          user_id: $userId,
          caption: $caption,
          tagged_users: $tags
        }
      ]
    ) {
      affectedCount
      records {
        id
        image_url
        user_id
        caption
        tagged_users
      }
    }
  }`;

export const DELETE_POST = `
mutation DeletePost($postId: UUID!) {
  deleteFrompostsCollection(
    filter: { id: { eq: $postId } }
  ) {
      affectedCount
    }
  }
`;

export const UPDATE_LIKES = `
mutation UpdateLikes($postId: UUID!, $likes: [UUID!]) {
  updatepostsCollection(
    filter: { id: { eq: $postId } },
    set: { likes: $likes }
  ) {
    affectedCount
  }
}
`;
