export interface User {
  id: number;
  email: string;
  username: string;
}

const SEED_USERS: User[] = [
  { id: 1, email: "john@example.com", username: "John_Doe" },
  { id: 2, email: "olena@example.com", username: "olena_m" },
];

let users: User[] = [];

export const userRepository = {
  findByEmail(email: string): User | undefined {
    return users.find((u) => u.email === email);
  },

  findById(id: number): User | undefined {
    return users.find((u) => u.id === id);
  },

  findByUsername(username: string): User | undefined {
    return users.find((u) => u.username === username);
  },

  create(data: Omit<User, "id">): User {
    const user: User = { id: users.length + 1, ...data };
    users.push(user);
    return user;
  },

  updateEmail(id: number, email: string): User {
    const index = users.findIndex((u) => u.id === id);
    if (index === -1) throw new Error(`User ${id} not found`);
    users[index] = { ...users[index], email };
    return users[index];
  },

  // Повертає сховище до початкових даних. Використовується в тестах.
  reset(): void {
    users = SEED_USERS.map((u) => ({ ...u }));
  },
};

userRepository.reset();
