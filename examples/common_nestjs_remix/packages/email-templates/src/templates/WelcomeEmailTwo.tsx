import { Button, Html } from "@react-email/components";

// export type WelcomeEmailProps = {
//   email: string;
//   name: string;
// };

export const WelcomeEmailTwo = () => {
  return (
    <Html>
      <Button
        href="https://selleo.com"
        style={{ background: "#000", color: "#fff", padding: "12px 20px" }}
      ></Button>
    </Html>
  );
};

// WelcomeEmail.PreviewProps = {
//   email: "test@test.com",
//   name: "Selleo Dev",
// };

// export default WelcomeEmailTwo;
