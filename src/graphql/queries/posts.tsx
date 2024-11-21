export const FETCH_POSTS = `
query FetchPosts {
  postsCollection {
    edges {
      node {
        id
        caption
        user_id
        image_url
        likes
        tagged_users
      }
    }
  }
}
`;
export const FETCH_POST_BY_ID = `
query FetchPostById($postId: UUID!) {
  postsCollection(filter: { id: { eq: $postId } }) {
    edges {
      node {
        id
        caption
        user_id
        image_url
        likes
        tagged_users
      }
    }
  }
}
`;
export const FETCH_POSTS_BY_USER_IDS = `
query FetchPostsByUserIds($userIds: [UUID!]) {
  postsCollection(
    filter: {
      user_id: { in: $userIds }
    }
    orderBy: {
      created_at: DescNullsLast
    }
  ) {
    edges {
      node {
        id
        caption
        user_id
        image_url
        likes
        tagged_users
        created_at
        users{
        username
        profile_pic
        id
        }
      }
    }
  }
}
`;
