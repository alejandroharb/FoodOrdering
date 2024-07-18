import { supabase } from "@/lib/supabase";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const useProductList = () => {
  return useQuery({
    queryKey: ["product"],
    queryFn: async () => {
      const { data, error } = await supabase.from("products").select("*");
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });
};

export const useProduct = (id: number) => {
  return useQuery({
    queryKey: ["product", id], //adding the id in the queryKey is important to store the information in different cache and not override
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });
};

export const useInsertProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    async mutationFn(data: any) {
      const { error, data: newProduct } = await supabase
        .from("products")
        .insert({
          name: data.name,
          image: data.image,
          price: data.price,
        })
        .single();

      if (error) {
        throw new Error(error.message);
      }
      return newProduct;
    },
    // this function is an option that gets called via mutationFn when mutation was successfully completed
    async onSuccess() {
      // queryClient is used to "invalidate the query" (or fetch database again) for the key that matches 'products'
      //this allows us to refresh the list automatically
      await queryClient.invalidateQueries(["products"]);
    },
    onError(error) {
      //can handle er ror here
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    async mutationFn(data: any) {
      const { error, data: updatedProduct } = await supabase
        .from("products")
        .update({
          name: data.name,
          image: data.image,
          price: data.price,
        })
        .eq("id", data.id)
        .single();

      if (error) {
        throw new Error(error.message);
      }
      return updatedProduct;
    },
    // this function is an option that gets called via mutationFn when mutation was successfully completed
    async onSuccess(_, { id }) {
      // queryClient is used to "invalidate the query" (or fetch database again) for the key that matches 'products'
      //this allows us to refresh the list automatically
      await queryClient.invalidateQueries(["products"]);
      await queryClient.invalidateQueries(["products", id]);
    },
    onError(error) {
      //can handle er ror here
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    async mutationFn(id: number) {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) {
        throw new Error(error.message);
      }
    },
    async onSuccess() {
      await queryClient.invalidateQueries(["products"]);
    },
  });
};
