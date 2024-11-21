import { getIdToken } from "firebase/auth";
import { auth } from "./firebase";

const supabaseUrl = "YOUR_SUPABASE_URL";
const supabaseAnonKey = "YOUR_SUPABASE_ANON_KEY";
const graphqlEndpoint = `${supabaseUrl}/graphql/v1`; // Supabase GraphQL endpoint

const fetchGraphQLData = async () => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("No user signed in.");

    // Get Firebase user ID token
    const token = await getIdToken(user);

    // Define your GraphQL query
    const query = `
      query {
        your_table {
          id
          column1
          column2
        }
      }
    `;

    // Make a POST request to the Supabase GraphQL endpoint
    const response = await fetch(graphqlEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Firebase ID token for authentication
        apikey: supabaseAnonKey, // Required for Supabase GraphQL
      },
      body: JSON.stringify({ query }),
    });

    const result = await response.json();

    if (result.errors) {
      console.error("GraphQL Errors:", result.errors);
    } else {
      console.log("Data:", result.data);
    }
  } catch (error: any) {
    console.error("Error fetching data:", error.message);
  }
};

export default fetchGraphQLData;
