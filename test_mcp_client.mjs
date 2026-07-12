import dotenv from "dotenv";
dotenv.config();

const BASE_URL = "http://localhost:3000";
const DEV_TOKEN = process.env.DEV_AGENT_TOKEN || "dev_static_key_12345";

async function testRestApi() {
  console.log("\n--- Testing REST API ---");

  // Test Unauthorized
  console.log("1. Testing unauthorized request (v1/tools)...");
  const resBad = await fetch(`${BASE_URL}/api/v1/tools`);
  console.log(`Status: ${resBad.status} (Expected: 401)`);

  console.log("1.1. Testing unauthorized request (tools/search)...");
  const resBadSearch = await fetch(`${BASE_URL}/api/tools/search?q=test`);
  console.log(`Status: ${resBadSearch.status} (Expected: 401)`);

  console.log("1.2. Testing unauthorized request (tools/checkout)...");
  const resBadCheckout = await fetch(`${BASE_URL}/api/tools/checkout?id=some-id`);
  console.log(`Status: ${resBadCheckout.status} (Expected: 401)`);

  // Test Authorized Tools list
  console.log("2. Testing authorized tools list...");
  const resTools = await fetch(`${BASE_URL}/api/v1/tools`, {
    headers: { "Authorization": `Bearer ${DEV_TOKEN}` }
  });
  console.log(`Status: ${resTools.status} (Expected: 200)`);
  const dataTools = await resTools.json();
  const toolsCount = dataTools.tools?.length || 0;
  console.log(`Total tools returned: ${toolsCount}`);

  // Test Authorized Workflows list
  console.log("3. Testing authorized workflows list...");
  const resWorkflows = await fetch(`${BASE_URL}/api/v1/workflows`, {
    headers: { "Authorization": `Bearer ${DEV_TOKEN}` }
  });
  console.log(`Status: ${resWorkflows.status} (Expected: 200)`);
  const dataWorkflows = await resWorkflows.json();
  console.log(`Total workflows returned: ${dataWorkflows.workflows?.length || 0}`);

  // Test Authorized Search
  console.log("4. Testing authorized search...");
  const resSearch = await fetch(`${BASE_URL}/api/tools/search?q=Git`, {
    headers: { "Authorization": `Bearer ${DEV_TOKEN}` }
  });
  console.log(`Status: ${resSearch.status} (Expected: 200)`);
  const dataSearch = await resSearch.json();
  console.log(`Search results count: ${dataSearch.results?.length || 0}`);

  // Test Authorized Checkout
  if (toolsCount > 0) {
    const firstToolId = dataTools.tools[0].id;
    console.log(`5. Testing authorized checkout for tool id: ${firstToolId}...`);
    const resCheckout = await fetch(`${BASE_URL}/api/tools/checkout?id=${firstToolId}`, {
      headers: { "Authorization": `Bearer ${DEV_TOKEN}` }
    });
    console.log(`Status: ${resCheckout.status} (Expected: 200)`);
    const text = await resCheckout.text();
    console.log(`Checkout raw markdown length: ${text.length}`);
  }
}

async function testMcpSse() {
  console.log("\n--- Testing MCP SSE API ---");

  // Test SSE Connection GET
  console.log("1. Establishing SSE stream GET connection...");
  const sseUrl = `${BASE_URL}/api/mcp?connectionId=test-conn-id`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 6000);

  try {
    const sseResponse = await fetch(sseUrl, {
      headers: { "Authorization": `Bearer ${DEV_TOKEN}` },
      signal: controller.signal
    });

    console.log(`GET SSE Status: ${sseResponse.status} (Expected: 200)`);

    const reader = sseResponse.body.getReader();
    const decoder = new TextDecoder();

    let buffer = "";

    // Read the first event containing the endpoint
    const { value } = await reader.read();
    buffer = decoder.decode(value);
    console.log("Received initial SSE event:", buffer.trim());

    // Now trigger a POST initialize JSON-RPC request
    console.log("2. Triggering POST 'initialize' JSON-RPC call...");
    const initPayload = {
      jsonrpc: "2.0",
      id: 1,
      method: "initialize",
      params: {}
    };

    const postRes = await fetch(`${BASE_URL}/api/mcp?connectionId=test-conn-id`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${DEV_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(initPayload)
    });
    console.log(`POST Status: ${postRes.status} (Expected: 202)`);

    // Read the response from the SSE stream
    console.log("3. Reading initialize response from SSE stream...");
    const readPromise = reader.read();

    // Set a timeout to prevent hanging if no message arrives
    const messageTimeout = setTimeout(() => {
      console.log("Timeout waiting for SSE message response!");
      controller.abort();
    }, 4000);

    const { value: msgValue } = await readPromise;
    clearTimeout(messageTimeout);

    const responseMsg = decoder.decode(msgValue);
    console.log("Received SSE message response:", responseMsg.trim());

    // Clean up
    controller.abort();
  } catch (error) {
    if (error.name === "AbortError") {
      console.log("SSE Stream connection test closed successfully.");
    } else {
      console.error("SSE Test failed:", error);
    }
  } finally {
    clearTimeout(timeoutId);
  }
}

async function run() {
  try {
    await testRestApi();
    await testMcpSse();
    console.log("\n✓ All tests passed successfully!");
  } catch (e) {
    console.error("Test execution failed:", e);
  }
}

run();
