const BASE_URL = "http://localhost:4000";

const getToken = () => localStorage.getItem("token") || "";

const headers = (isJson = true) => ({
  Authorization: `Bearer ${getToken()}`,
  ...(isJson ? { "Content-Type": "application/json" } : {}),
});


export async function loginUser(email: string, password: string) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "שגיאה בהתחברות");
  return data;
}

export async function registerUser(data: {
  name: string;
  email: string;
  password: string;
}) {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "שגיאה בהרשמה");
  return result;
}

export async function getCurrentUser() {
  const res = await fetch(`${BASE_URL}/auth/me`, {
    headers: headers(false),
  });
  if (!res.ok) throw new Error("Unauthorized");
  return res.json();
}


export async function fetchUsers() {
  const res = await fetch(`${BASE_URL}/users`, {
    headers: headers(false),
  });
  if (!res.ok) throw new Error("שגיאה בטעינת משתמשים");
  return res.json();
}

export async function createUser(data: {
  name: string;
  email: string;
  password: string;
  role: "admin" | "agent" | "customer";
}) {
  const res = await fetch(`${BASE_URL}/users`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify(data),
  });

  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "שגיאה ביצירת משתמש");
  return result;
}


export async function fetchTickets() {
  const res = await fetch(`${BASE_URL}/tickets`, {
    headers: headers(false),
  });
  if (!res.ok) throw new Error("שגיאה בטעינת טיקטים");
  return res.json();
}

export async function fetchTicketById(id: number) {
  const res = await fetch(`${BASE_URL}/tickets/${id}`, {
    headers: headers(false),
  });
  if (!res.ok) throw new Error("שגיאה בטעינת טיקט");
  return res.json();
}

export async function createTicket(payload: any) {
  const res = await fetch(`${BASE_URL}/tickets`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "שגיאה ביצירת טיקט");
  return data;
}

export async function updateTicket(id: number, payload: any) {
  const res = await fetch(`${BASE_URL}/tickets/${id}`, {
    method: "PATCH",
    headers: headers(),
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "שגיאה בעדכון טיקט");
  return data;
}


export async function fetchComments(ticketId: number) {
  const res = await fetch(`${BASE_URL}/tickets/${ticketId}/comments`, {
    headers: headers(false),
  });
  if (!res.ok) throw new Error("שגיאה בטעינת תגובות");
  return res.json();
}

export async function addComment(ticketId: number, content: string) {
  const res = await fetch(`${BASE_URL}/tickets/${ticketId}/comments`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({ content }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "שגיאה בהוספת תגובה");
  return data;
}


export async function fetchStatuses() {
  const res = await fetch(`${BASE_URL}/statuses`, {
    headers: headers(false),
  });
  if (!res.ok) throw new Error("שגיאה בטעינת סטטוסים");
  return res.json();
}

export async function createStatus(name: string) {
  const res = await fetch(`${BASE_URL}/statuses`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({ name }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "שגיאה ביצירת סטטוס");
  return data;
}


export async function fetchPriorities() {
  const res = await fetch(`${BASE_URL}/priorities`, {
    headers: headers(false),
  });
  if (!res.ok) throw new Error("שגיאה בטעינת עדיפויות");
  return res.json();
}

export async function createPriority(name: string) {
  const res = await fetch(`${BASE_URL}/priorities`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({ name }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "שגיאה ביצירת עדיפות");
  return data;
}
