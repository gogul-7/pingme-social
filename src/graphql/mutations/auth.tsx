export const SIGNUP_USER = `
mutation InsertUser(
  $email: String!, 
  $username: String!, 
) {
  insertIntousersCollection(
    objects: [
      {
        email: $email,
        username: $username
      }
    ]
  ) {
    affectedCount
    records {
      id
      email
      full_name
      username
      phone_number
    }
  }
}
`;
