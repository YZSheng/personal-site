import supabase from "./supabase.server";

// TODO Add ORM
export const findAllBlogPosts = async () => {
  return await supabase.from("Blog").select("id, slug, title");
};

export const findOneBlogPost = async (slug: string) => {
  return await supabase.from("Blog").select("*").eq("slug", slug).single();
};
