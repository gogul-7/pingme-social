export const FETCH_USERS = `
query {
  usersCollection {
    edges {
      node {
        id
        email
        full_name
        username
      }
    }
  }
}`;

export const FETCH_USER_BY_EMAIL = `
query FetchUserByEmail($email: String!) {
  usersCollection(filter: { email: { eq: $email } }) {
    edges {
      node {
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
}`;
export const FETCH_USER_BY_IDS = `
query FetchUserByIds($userIds: [UUID!]) {
  usersCollection(
    filter: {
      id: { in: $userIds }
    }
  ) {
    edges {
      node {
        id
        email
        full_name
        username
        }
      }
    }
  }
`;
