export const CREATE_FOLLOWS = `
mutation InsertFollows($user_id: UUID!) {
  insertIntofollowsCollection(
    objects: [
      {
        user_id: $user_id,
        follower_id: [],
        following_id: []
      }
    ]
  ) {
    affectedCount
    records {
      
      user_id
      follower_id
      following_id
    }
  }
}
`;
