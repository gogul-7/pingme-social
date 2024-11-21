export const EDIT_USER = `
  mutation UpdateUser(
  $id: UUID!,
  $full_name: String,
  $username: String,
  $phone_number: String,
  $bio: String,
  $profile_pic: String!, 
) {
  updateusersCollection(
    filter: { id: { eq: $id } },
    set: {
      full_name: $full_name,
      username: $username,
      phone_number: $phone_number,
      bio: $bio,
      profile_pic: $profile_pic
    }
  ) {
    affectedCount
    records {
      id
      email
      full_name
      username
      phone_number
      bio
      profile_pic
    }
  }
}
  `;
