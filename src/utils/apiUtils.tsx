import { DELETE_POST } from "../graphql/mutations/posts";
import { FETCH_USER_BY_EMAIL } from "../graphql/queries/users";
import { supabase } from "../supabase/supabaseClient";
import { server_url, supabase_key } from "./constants";

export const handleFetchUSer = async (email: string) => {
  try {
    const response = await fetch(`${server_url}/graphql/v1`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apiKey: supabase_key,
      },
      body: JSON.stringify({
        query: FETCH_USER_BY_EMAIL,
        variables: {
          email: email,
        },
      }),
    });

    const { data, errors } = await response.json();
    if (errors) throw new Error(errors[0].message);
    return data.usersCollection.edges[0].node || null;
  } catch (error: any) {
    console.error(error);
    throw error;
  }
};

export const handleUpload = async (file: File) => {
  if (file) {
    const fileType = file.type.startsWith("image/") ? "images" : "videos";
    const filePath = `${fileType}/${file.name}`;

    const { error } = await supabase.storage
      .from("media")
      .upload(filePath, file);

    if (error) {
      console.error("Upload Error:", error.message);
      return;
    }

    const { data: publicData } = supabase.storage
      .from("media")
      .getPublicUrl(filePath);
    return publicData.publicUrl;
  }
};

export const deletePostWithId = async (id: string) => {
  try {
    const response = await fetch(`${server_url}/graphql/v1`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apiKey: supabase_key,
      },
      body: JSON.stringify({
        query: DELETE_POST,
        variables: {
          postId: id,
        },
      }),
    });

    const { data, errors } = await response.json();
    if (errors) throw new Error(errors[0].message);
    return data;
  } catch (error: any) {
    console.error(error);
    throw error;
  }
};
