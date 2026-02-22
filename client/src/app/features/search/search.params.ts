export type SearchHeritagesApiResponse = {
  status: "success" | "error";
  data: {
    data: object[];
    pagination: {
      current_page: number;
      per_page: number;
      total: number;
      last_page: number;
    };
  };
};
