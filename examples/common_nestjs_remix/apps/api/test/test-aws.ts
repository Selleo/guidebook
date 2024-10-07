import {
  LocalstackContainer,
  StartedLocalStackContainer,
} from "@testcontainers/localstack";

let container: StartedLocalStackContainer;

export async function setupTestLocalstack(): Promise<{
  container: StartedLocalStackContainer;
  endpoint: string;
}> {
  container = await new LocalstackContainer().start();

  const endpoint = container.getConnectionUri();

  return { container, endpoint };
}

export async function closeLocalstack() {
  if (container) await container.stop();
}
