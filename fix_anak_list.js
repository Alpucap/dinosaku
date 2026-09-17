const fs = require('fs');
let code = fs.readFileSync('app/pembimbing/anak/AnakListClient.tsx', 'utf-8');

const target = `  const searchParams = useSearchParams();
  const initialClassId = searchParams.get("classId") || "all";
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClass, setSelectedClass] = useState(initialClassId);`;

const replacement = `  const searchParams = useSearchParams();
  const initialClassId = searchParams.get("classId");
  const isValidClassId = classrooms.some(c => c.id === initialClassId);
  const defaultClass = isValidClassId ? initialClassId! : "all";
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClass, setSelectedClass] = useState(defaultClass);`;

code = code.replace(target, replacement);
fs.writeFileSync('app/pembimbing/anak/AnakListClient.tsx', code);
