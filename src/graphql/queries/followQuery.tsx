export const FETCH_FOLLOWS = `
query FetchFollows($userId: UUID!) {
  followsCollection(filter: { user_id: { eq: $userId } }) {
    edges {
      node {
        follower_id
        following_id
      }
    }
  }
}
`;

export const FETCH_CURRENT_FOLLOWING = `
query GetCurrentFollowing($userId: UUID!) {
  followsCollection(filter: { user_id: { eq: $userId } }) {
    edges {
      node {
        following_id
        follower_id
      }
    }
  }
}`;

export const UPDATE_CURRENT_FOLLOWING = `
        mutation UpdateFollowing($userId: UUID!, $following_id: [UUID!]) {
          updatefollowsCollection(
            filter: { user_id: { eq: $userId } }
            set: { following_id: $following_id }
          ) {
            affectedCount
          }
        }`;
export const UPDATE_CURRENT_FOLLOWER = `
        mutation UpdateFollowing($userId: UUID!, $following_id: [UUID!]) {
          updatefollowsCollection(
            filter: { user_id: { eq: $userId } }
            set: { follower_id: $follower_id }
          ) {
            affectedCount
          }
        }`;
