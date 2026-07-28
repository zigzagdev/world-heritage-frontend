import { useParams } from "react-router-dom";
import { UserProfileContainer } from "./user-profile-container";

export function UserGetContainer() {
  const { id } = useParams<{ id: string }>();

  return <UserProfileContainer id={Number(id)} />;
}
