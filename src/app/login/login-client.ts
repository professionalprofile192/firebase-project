const handleLogin = async (values: any) => {
  try {
    const response = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    const data = await response.json();

    console.log("LOGIN FULL RESPONSE:", data);

    if (data.errmsg || data.message?.includes("Invalid")) {
      alert("❌ Invalid User");
      return;
    }

    alert("✅ Login Success");

    // --- Extract tokens ---
    const authToken = data?.claims_token?.value;  // x-kony-authorization
    const requestId =
      data?.provider_token?.params?.security_attributes?.session_token; // x-kony-requestid

    console.log("AUTH TOKEN:", authToken);
    console.log("REQUEST ID:", requestId);

    // --- Now call SESSION API ---
    const attributesRes = await fetch("/api/user-attributes", {
      method: "GET",
      headers: {
        "x-kony-authorization": authToken || "",
        "x-kony-requestid": requestId || "",
      },
      credentials: "include",
    });

    const attributes = await attributesRes.json();
    console.log("🔥 USER ATTRIBUTES →", attributes);

  } catch (error) {
    console.error(error);
    alert("Something went wrong");
  }
};
