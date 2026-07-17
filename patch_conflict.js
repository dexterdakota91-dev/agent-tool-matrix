const fs = require('fs');

// Patch bolt.md
let boltMd = fs.readFileSync('.jules/bolt.md', 'utf8');
boltMd = boltMd.replace(/<<<<<<< HEAD[\s\S]*?=======\n/g, '').replace(/>>>>>>> origin\/main\n/g, '');
fs.writeFileSync('.jules/bolt.md', boltMd);

// Patch route.ts
let routeTs = fs.readFileSync('src/app/api/mcp/route.ts', 'utf8');
routeTs = routeTs.replace(/<<<<<<< HEAD\n        \/\/ Optimization: Fetch only id and title for in-memory filtering, then query full object\n        const dbTools = await prisma.tool.findMany\({ select: { id: true, title: true } }\);\n        const match = dbTools.find\(t => normalizeName\(t.title\) === name\);\n=======\n        \/\/ Fetch only id and title for matching to reduce memory footprint\n        const partialTools = await prisma.tool.findMany\({ select: { id: true, title: true } }\);\n        const match = partialTools.find\(t => normalizeName\(t.title\) === name\);\n>>>>>>> origin\/main/g,
`        // Optimization: Fetch only id and title for in-memory filtering, then query full object
        const dbTools = await prisma.tool.findMany({ select: { id: true, title: true } });
        const match = dbTools.find(t => normalizeName(t.title) === name);`);

routeTs = routeTs.replace(/<<<<<<< HEAD\n        \/\/ Optimization: Fetch only id and title for in-memory filtering, then query full object\n        const dbTools = await prisma.tool.findMany\({\n=======\n        \/\/ Fetch only id and title for matching to reduce memory footprint\n        const partialTools = await prisma.tool.findMany\({\n>>>>>>> origin\/main/g,
`        // Optimization: Fetch only id and title for in-memory filtering, then query full object
        const dbTools = await prisma.tool.findMany({`);

routeTs = routeTs.replace(/<<<<<<< HEAD\n        const match = dbTools.find\(t => normalizeName\(t.title\) === name\);\n        if \(!match\) throw new Error\("Prompt not found"\);\n\n=======\n        const match = partialTools.find\(t => normalizeName\(t.title\) === name\);\n        if \(!match\) throw new Error\("Prompt not found"\);\n>>>>>>> origin\/main/g,
`        const match = dbTools.find(t => normalizeName(t.title) === name);
        if (!match) throw new Error("Prompt not found");
`);

fs.writeFileSync('src/app/api/mcp/route.ts', routeTs);

console.log("Patched conflicts");
