import SectionTitle from "@/components/SectionTitle";
import { Container } from "@/components/public/layout/Container";
import SeedProjectsButton from "./SeedProjectsButton";

export default function SeedProjectsPage() {
  return (
    <main>
      <section>
        <Container className="pt-8 pb-10 space-y-4">
          <SectionTitle>Seed Projects</SectionTitle>
          <p className="text-muted-foreground">
            Click the button to write the local sample projects into Firestore.
          </p>
          <SeedProjectsButton />
        </Container>
      </section>
    </main>
  );
}
