const fs = require('fs');
let schema = fs.readFileSync('prisma/schema.prisma', 'utf-8');

// 1. Remove classCode from User
schema = schema.replace(/  classCode     String\?\\n/, '');

// 2. Add relation fields to User
const userFieldsToAdd = `
  // Multi-class System
  ownedClasses  Classroom[] @relation("TeacherClasses")
  joinedClasses Classroom[] @relation("StudentClasses")
`;
schema = schema.replace('  createdAt     DateTime  @default(now())', userFieldsToAdd + '\n  createdAt     DateTime  @default(now())');

// 3. Add Classroom model
const classroomModel = `
model Classroom {
  id        String   @id @default(uuid())
  name      String
  code      String   @unique
  
  teacherId String
  teacher   User     @relation("TeacherClasses", fields: [teacherId], references: [id], onDelete: Cascade)
  
  students  User[]   @relation("StudentClasses")
  
  createdAt DateTime @default(now())
}
`;
schema += classroomModel;

fs.writeFileSync('prisma/schema.prisma', schema);
console.log("Schema updated.");
