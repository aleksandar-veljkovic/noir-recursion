const { createReadableStreamFromReadable } = require('@remix-run/node');
const { Noir } = require('@noir-lang/noir_js');
const { compile, createFileManager } = require('@noir-lang/noir_wasm');
const { BarretenbergBackend } = require('@noir-lang/backend_barretenberg');
const { performance } = require('perf_hooks');
const path = require('path');
const util = require('util');
const { execFile } = require('child_process');
const fs = require('fs');
const execFileAsync = util.promisify(execFile);

async function getCircuit(name) {
    const startTime = performance.now();
    const fm = createFileManager(path.join(__dirname, 'build'));
    const nr = fs.createReadStream(`./${name}/src/main.nr`, 'utf8');
    await fm.writeFile('./src/main.nr', createReadableStreamFromReadable(nr));

    const nargoToml = fs.createReadStream(`./${name}/Nargo.toml`, 'utf8');
    await fm.writeFile('./Nargo.toml', createReadableStreamFromReadable(nargoToml));

    const result = await compile(fm);
    if (!('program' in result)) {
        throw new Error('Compilation failed');
    }

    const endTime = performance.now();
    console.log(`Circuit "${name}" loaded and compiled in ${(endTime - startTime).toFixed(2)} ms`);
    return result.program;
}

function readResult(path) {
    return new Promise((resolve, reject) => {
        fs.readFile(path, 'utf8', (err, data) => {
            if (err) {
                reject("Greška pri čitanju JSON fajla");
            } else {
                const jsonData = JSON.parse(data);
                resolve(jsonData);
            }
        });
    });
}

async function aes() {
    try {
        console.log("Pokrecem aes.sh...");
        let { stdout } = await execFileAsync('./aes.sh');
        console.log(`Izlaz aes.sh:\n${stdout}`);

        console.log("Izvrsio se MAIN");
        let data_json = await readResult('aes_main/main.json');
        let public_inputs = [data_json.i, ...data_json.return];

        let circuit = await getCircuit('aes_main');
        let backend = new BarretenbergBackend(circuit, { threads: 8 });

        let uint8Array;
        try {
            const data = fs.readFileSync('./aes_main/proofs/aes_main.proof', 'utf8');
            const hexArray = data.match(/.{1,2}/g);
            uint8Array = new Uint8Array(hexArray.map(h => parseInt(h, 16)));
        } catch (err) {
            console.error("Greška pri čitanju fajla:", err);
            return;
        }

        const mainProofArtifacts = await backend.generateRecursiveProofArtifacts(
            { publicInputs: public_inputs, proof: uint8Array },
            public_inputs.length
        );

        await backend.destroy();

        console.log("Pokrecem aes_rec.sh...");
        let { stdout: stdout2 } = await execFileAsync('./aes_rec.sh', [JSON.stringify(mainProofArtifacts), public_inputs]);
        console.log(`Izlaz aes_rec.sh:\n${stdout2}`);

        console.log("Izvrsio se REC1");
        data_json = await readResult('aes_prepare/prepare.json');
        public_inputs = [data_json.i, ...data_json.return];

        circuit = await getCircuit('aes_prepare');
        backend = new BarretenbergBackend(circuit, { threads: 8 });

        try {
            const data = fs.readFileSync('./aes_prepare/proofs/aes_prepare.proof', 'utf8');
            const chunks = [];
            const chunkSize = 64;
            for (let i = 0; i < 16; i++) {
                const chunk = data.slice(i * chunkSize, (i + 1) * chunkSize);
                if (chunk.length === chunkSize) {
                    public_inputs.push(`0x${chunk}`);
                }
            }

            const remaining = data.slice(16 * chunkSize);
            const hexArray = remaining.match(/.{1,2}/g);
            uint8Array = new Uint8Array(hexArray.map(h => parseInt(h, 16)));
        } catch (err) {
            console.error("Greška pri čitanju fajla:", err);
            return;
        }
        console.log(public_inputs)
        console.log("Pokrecem aes_recursion.sh...");
        let RecProofArtifacts = await backend.generateRecursiveProofArtifacts(
            { publicInputs: public_inputs, proof: uint8Array },
            public_inputs.length
        );

        await backend.destroy();
        let i = 2;
        let { stdout: stdout3 } = await execFileAsync('./aes_recursion.sh', [JSON.stringify(RecProofArtifacts), public_inputs, i]);
        i++;
        console.log(`Izlaz aes_recursion.sh:\n${stdout3}`);

        data_json = await readResult('./aes_recursion/recursion.json');
        public_inputs = [data_json.i, ...data_json.return];
        //do ovde radi
        circuit = await getCircuit('aes_recursion');
        backend = new BarretenbergBackend(circuit, { threads: 8 });

        try {
            const data = fs.readFileSync('./aes_recursion/proofs/aes_recursion.proof', 'utf8');
            const chunks = [];
            const chunkSize = 64;
            for (let i = 0; i < 16; i++) {
                const chunk = data.slice(i * chunkSize, (i + 1) * chunkSize);
                if (chunk.length === chunkSize) {
                    public_inputs.push(`0x${chunk}`);
                }
            }

            const remaining = data.slice(16 * chunkSize);
            const hexArray = remaining.match(/.{1,2}/g);
            uint8Array = new Uint8Array(hexArray.map(h => parseInt(h, 16)));
        } catch (err) {
            console.error("Greška pri čitanju fajla:", err);
            return;
        }

        console.log(public_inputs)
        console.log("Pokrecem aes_recursion.sh...");
        RecProofArtifacts = await backend.generateRecursiveProofArtifacts(
            { publicInputs: public_inputs, proof: uint8Array },
            public_inputs.length
        );

        await backend.destroy();
        console.log(public_inputs)
        console.log(RecProofArtifacts)
        let { stdout: stdout4 } = await execFileAsync('./aes_recursion.sh', [JSON.stringify(RecProofArtifacts), public_inputs, i]);
        i++;
        console.log(`Izlaz aes_recursion.sh:\n${stdout4}`);

        data_json = await readResult('./aes_recursion/recursion.json');
        public_inputs = [data_json.i, ...data_json.return];
        console.log(public_inputs);
        // do ovde radi 2 part
        circuit = await getCircuit('aes_recursion');
        backend = new BarretenbergBackend(circuit, { threads: 8 });

        try {
            const data = fs.readFileSync('./aes_recursion/proofs/aes_recursion.proof', 'utf8');
            const chunks = [];
            const chunkSize = 64;
            for (let i = 0; i < 16; i++) {
                const chunk = data.slice(i * chunkSize, (i + 1) * chunkSize);
                if (chunk.length === chunkSize) {
                    public_inputs.push(`0x${chunk}`);
                }
            }

            const remaining = data.slice(16 * chunkSize);
            const hexArray = remaining.match(/.{1,2}/g);
            uint8Array = new Uint8Array(hexArray.map(h => parseInt(h, 16)));
        } catch (err) {
            console.error("Greška pri čitanju fajla:", err);
            return;
        }

        console.log(public_inputs)
        console.log("Pokrecem aes_recursion.sh...");
        RecProofArtifacts = await backend.generateRecursiveProofArtifacts(
            { publicInputs: public_inputs, proof: uint8Array },
            public_inputs.length
        );

        await backend.destroy();
        console.log(public_inputs)
        console.log(RecProofArtifacts)
        let { stdout: stdout5 } = await execFileAsync('./aes_recursion.sh', [JSON.stringify(RecProofArtifacts), public_inputs, i]);
        i++;
        console.log(`Izlaz aes_recursion.sh:\n${stdout5}`);

        data_json = await readResult('./aes_recursion/recursion.json');
        public_inputs = [data_json.i, ...data_json.return];
        console.log(public_inputs);
        //radi
        circuit = await getCircuit('aes_recursion');
        backend = new BarretenbergBackend(circuit, { threads: 8 });

        try {
            const data = fs.readFileSync('./aes_recursion/proofs/aes_recursion.proof', 'utf8');
            const chunks = [];
            const chunkSize = 64;
            for (let i = 0; i < 16; i++) {
                const chunk = data.slice(i * chunkSize, (i + 1) * chunkSize);
                if (chunk.length === chunkSize) {
                    public_inputs.push(`0x${chunk}`);
                }
            }

            const remaining = data.slice(16 * chunkSize);
            const hexArray = remaining.match(/.{1,2}/g);
            uint8Array = new Uint8Array(hexArray.map(h => parseInt(h, 16)));
        } catch (err) {
            console.error("Greška pri čitanju fajla:", err);
            return;
        }

        console.log(public_inputs)
        console.log("Pokrecem aes_recursion.sh...");
        RecProofArtifacts = await backend.generateRecursiveProofArtifacts(
            { publicInputs: public_inputs, proof: uint8Array },
            public_inputs.length
        );

        await backend.destroy();
        console.log(public_inputs)
        console.log(RecProofArtifacts)
        let { stdout: stdout6 } = await execFileAsync('./aes_recursion.sh', [JSON.stringify(RecProofArtifacts), public_inputs, i]);
        i++;
        console.log(`Izlaz aes_recursion.sh:\n${stdout6}`);

        data_json = await readResult('./aes_recursion/recursion.json');
        public_inputs = [data_json.i, ...data_json.return];
        console.log(public_inputs);
        //
        circuit = await getCircuit('aes_recursion');
        backend = new BarretenbergBackend(circuit, { threads: 8 });

        try {
            const data = fs.readFileSync('./aes_recursion/proofs/aes_recursion.proof', 'utf8');
            const chunks = [];
            const chunkSize = 64;
            for (let i = 0; i < 16; i++) {
                const chunk = data.slice(i * chunkSize, (i + 1) * chunkSize);
                if (chunk.length === chunkSize) {
                    public_inputs.push(`0x${chunk}`);
                }
            }

            const remaining = data.slice(16 * chunkSize);
            const hexArray = remaining.match(/.{1,2}/g);
            uint8Array = new Uint8Array(hexArray.map(h => parseInt(h, 16)));
        } catch (err) {
            console.error("Greška pri čitanju fajla:", err);
            return;
        }

        console.log(public_inputs)
        console.log("Pokrecem aes_recursion.sh...");
        RecProofArtifacts = await backend.generateRecursiveProofArtifacts(
            { publicInputs: public_inputs, proof: uint8Array },
            public_inputs.length
        );

        await backend.destroy();
        console.log(public_inputs)
        console.log(RecProofArtifacts)
        let { stdout: stdout7 } = await execFileAsync('./aes_recursion.sh', [JSON.stringify(RecProofArtifacts), public_inputs, i]);
        i++;
        console.log(`Izlaz aes_recursion.sh:\n${stdout7}`);

        data_json = await readResult('./aes_recursion/recursion.json');
        public_inputs = [data_json.i, ...data_json.return];
        console.log(public_inputs);
        //
        circuit = await getCircuit('aes_recursion');
        backend = new BarretenbergBackend(circuit, { threads: 8 });

        try {
            const data = fs.readFileSync('./aes_recursion/proofs/aes_recursion.proof', 'utf8');
            const chunks = [];
            const chunkSize = 64;
            for (let i = 0; i < 16; i++) {
                const chunk = data.slice(i * chunkSize, (i + 1) * chunkSize);
                if (chunk.length === chunkSize) {
                    public_inputs.push(`0x${chunk}`);
                }
            }

            const remaining = data.slice(16 * chunkSize);
            const hexArray = remaining.match(/.{1,2}/g);
            uint8Array = new Uint8Array(hexArray.map(h => parseInt(h, 16)));
        } catch (err) {
            console.error("Greška pri čitanju fajla:", err);
            return;
        }

        console.log(public_inputs)
        console.log("Pokrecem aes_recursion.sh...");
        RecProofArtifacts = await backend.generateRecursiveProofArtifacts(
            { publicInputs: public_inputs, proof: uint8Array },
            public_inputs.length
        );

        await backend.destroy();
        console.log(public_inputs)
        console.log(RecProofArtifacts)
        let { stdout: stdout8 } = await execFileAsync('./aes_recursion.sh', [JSON.stringify(RecProofArtifacts), public_inputs, i]);
        i++;
        console.log(`Izlaz aes_recursion.sh:\n${stdout8}`);

        data_json = await readResult('./aes_recursion/recursion.json');
        public_inputs = [data_json.i, ...data_json.return];
        console.log(public_inputs);
        //
        circuit = await getCircuit('aes_recursion');
        backend = new BarretenbergBackend(circuit, { threads: 8 });

        try {
            const data = fs.readFileSync('./aes_recursion/proofs/aes_recursion.proof', 'utf8');
            const chunks = [];
            const chunkSize = 64;
            for (let i = 0; i < 16; i++) {
                const chunk = data.slice(i * chunkSize, (i + 1) * chunkSize);
                if (chunk.length === chunkSize) {
                    public_inputs.push(`0x${chunk}`);
                }
            }

            const remaining = data.slice(16 * chunkSize);
            const hexArray = remaining.match(/.{1,2}/g);
            uint8Array = new Uint8Array(hexArray.map(h => parseInt(h, 16)));
        } catch (err) {
            console.error("Greška pri čitanju fajla:", err);
            return;
        }

        console.log(public_inputs)
        console.log("Pokrecem aes_recursion.sh...");
        RecProofArtifacts = await backend.generateRecursiveProofArtifacts(
            { publicInputs: public_inputs, proof: uint8Array },
            public_inputs.length
        );

        await backend.destroy();
        console.log(public_inputs)
        console.log(RecProofArtifacts)
        let { stdout: stdout9 } = await execFileAsync('./aes_recursion.sh', [JSON.stringify(RecProofArtifacts), public_inputs, i]);
        i++;
        console.log(`Izlaz aes_recursion.sh:\n${stdout9}`);

        data_json = await readResult('./aes_recursion/recursion.json');
        public_inputs = [data_json.i, ...data_json.return];
        console.log(public_inputs);
        //kraj

        circuit = await getCircuit('aes_recursion');
        backend = new BarretenbergBackend(circuit, { threads: 8 });

        try {
            const data = fs.readFileSync('./aes_recursion/proofs/aes_recursion.proof', 'utf8');
            const chunks = [];
            const chunkSize = 64;
            for (let i = 0; i < 16; i++) {
                const chunk = data.slice(i * chunkSize, (i + 1) * chunkSize);
                if (chunk.length === chunkSize) {
                    public_inputs.push(`0x${chunk}`);
                }
            }

            const remaining = data.slice(16 * chunkSize);
            const hexArray = remaining.match(/.{1,2}/g);
            uint8Array = new Uint8Array(hexArray.map(h => parseInt(h, 16)));
        } catch (err) {
            console.error("Greška pri čitanju fajla:", err);
            return;
        }

        console.log(public_inputs)
        console.log("Pokrecem aes_10_round.sh...");
        RecProofArtifacts = await backend.generateRecursiveProofArtifacts(
            { publicInputs: public_inputs, proof: uint8Array },
            public_inputs.length
        );

        await backend.destroy();
        console.log(public_inputs)
        console.log(RecProofArtifacts)
        let { stdout: stdout10 } = await execFileAsync('./aes_10_round.sh', [JSON.stringify(RecProofArtifacts), public_inputs, i]);
        i++;
        console.log(`Izlaz aes_10_round.sh:\n${stdout10}`);

    } catch (error) {
        console.error(`Greška u izvršavanju skripti: ${error.message}`);
    }
}

// async function aes() {

//     execFile('./aes.sh', (error, stdout, stderr) => {
//         if (error) {
//             //console.error(`Greška: ${error.message}`);
//             return;
//         }
//         if (stderr) {
//             //console.error(`stderr: ${stderr}`);
//             return;
//         }
//         console.log(`Izlaz:\n${stdout}`);
//     });

//     //izvrsi mi se main
//     console.log("dsdsa3");
//     let data_json = await readResult('aes_main/main.json');  
//     let public_inputs = [data_json.i,...data_json.return];
//     console.log(public_inputs);
//     console.log("Izvrsio se MAIN");
//     let circuit = await getCircuit('aes_main');
//     let backend = new BarretenbergBackend (circuit, { threads: 8 });
//     let uint8Array;
//     try {
//         const data = fs.readFileSync('./aes_main/proofs/aes_main.proof', 'utf8');
        
//         const hexArray = data.match(/.{1,2}/g);
    
//         uint8Array = new Uint8Array(hexArray.map(h => parseInt(h, 16)));
//     } catch (err) {
//         //console.error("Greška pri čitanju fajla:", err);
//     }
//     //console.log(uint8Array);
//     //console.log(public_inputs);

//     const mainProofArtifacts = await backend.generateRecursiveProofArtifacts(
//         { publicInputs: public_inputs, proof: uint8Array},
//         public_inputs.length
//     );

//     await backend.destroy();
//     execFile('./aes_rec.sh', [JSON.stringify(mainProofArtifacts),public_inputs],(error, stdout, stderr) => {
//         if (error) {
//             //console.error(`Greška: ${error.message}`);
//             return;
//         }
//         if (stderr) {
//             //console.error(`stderr: ${stderr}`);
//             return;
//         }
//         console.log(`Izlaz:\n${stdout}`);
//     });
//     console.log("dsdsa2");
//     data_json = await readResult('aes_prepare/prepare.json');  
//     public_inputs = [data_json.i,...data_json.return];
//     console.log("Izvrsio se REC1");
//     //console.log(public_inputs);

//     circuit = await getCircuit('aes_prepare');
//     backend = new BarretenbergBackend (circuit, { threads: 8 });  
//     try {
//         const data = fs.readFileSync('./aes_prepare/proofs/aes_prepare.proof', 'utf8');
        
//         const chunks = [];
//         const chunkSize = 64; // 64 bajta = 128 heks karaktera

//         for (let i = 0; i < 16; i++) {
//             const chunk = data.slice(i * chunkSize, (i + 1) * chunkSize);
//             if (chunk.length === chunkSize) {
//                 public_inputs.push("0x"+chunk);
//             }
//         }

//         // Ostatak podataka
//     const remaining = data.slice(16 * chunkSize);
//     const hexArray = remaining.match(/.{1,2}/g);

//     uint8Array = new Uint8Array(hexArray.map(h => parseInt(h, 16)));
//     } catch (err) {
//         //console.error("Greška pri čitanju fajla:", err);
//     }
//     console.log(public_inputs);
//     //console.log(uint8Array);
    
//     const RecProofArtifacts = await backend.generateRecursiveProofArtifacts(
//         { publicInputs: public_inputs, proof: uint8Array},
//         public_inputs.length
//     );
//     console.log(util.inspect(RecProofArtifacts, { showHidden: false, depth: null, maxArrayLength: null }));
//     await backend.destroy();
//     execFile('./aes_recursion.sh', [JSON.stringify(RecProofArtifacts),public_inputs],(error, stdout, stderr) => {
//         if (error) {
//             console.error(`Greška: ${error.message}`);
//             return;
//         }
//         if (stderr) {
//             console.error(`stderr: ${stderr}`);
//             return;
//         }
//         console.log(`Izlaz:\n${stdout}`);
//     });
//     console.log("dsdsa");
//     data_json = await readResult('./aes_recursion/recursion.json');  
//     public_inputs = [data_json.i,...data_json.return];
//     console.log(public_inputs);
    // const script = spawn('./aes.sh');  // Pokrećeš aes.sh skriptu
    // script.stdout.on('data', (data) => {
    //     console.log(`Izlaz: ${data}`);
    // });

    // script.on('close', async (code) => {
    //     if (code === 0) {
    //         console.log("Skripta je uspešno završena.");
    //         try {
    //             let data_json = await readResult('aes_main/main.json');  
    //             const public_inputs = [data_json.i,...data_json.return];
    //             console.log(public_inputs);
    //             const circuit = await getCircuit('aes_main');
    //             const backend = new BarretenbergBackend(circuit, { threads: 8 });
               
    //             let uint8Array;
    //             try {
    //                 const data = fs.readFileSync('./aes_main/proofs/aes_main.proof', 'utf8');
                    
    //                 const hexArray = data.match(/.{1,2}/g);
                
    //                 uint8Array = new Uint8Array(hexArray.map(h => parseInt(h, 16)));
    //             } catch (err) {
    //                 //console.error("Greška pri čitanju fajla:", err);
    //             }
    //             const mainProofArtifacts = await backend.generateRecursiveProofArtifacts(
    //                 { publicInputs: public_inputs, proof: uint8Array},
    //                 public_inputs.length
    //             );
    //             await backend.destroy();
    //             console.log("Backend uništen");
    //             const script2 = spawn('./aes_rec.sh',[JSON.stringify(mainProofArtifacts),public_inputs,1]);
    //             script2.stdout.on('data', (data) => {
    //                 console.log(`Izlaz iz druga_skripta.sh: ${data}`);
    //             });
    //             script2.stderr.on('data', (data) => {
    //                 //console.error(`Greška iz aes_rec.sh: ${data.toString()}`);
    //             });
    //             script2.on('close', async (code2) => {
    //             if (code2 === 0) {
    //                 let data_json = await readResult('aes_prepare/prepare.json');  
    //                 const public_inputs = [data_json.i,...data_json.return];
    //                 console.log(public_inputs);
    //                 const circuit = await getCircuit('aes_prepare');
    //                 const backend = new BarretenbergBackend(circuit, { threads: 8 });
                
    //                 let uint8Array;
    //                 try {
    //                     const data = fs.readFileSync('./aes_prepare/proofs/aes_prepare2.proof', 'utf8');
                        
    //                     const chunks = [];
    //                     const chunkSize = 64; // 64 bajta = 128 heks karaktera

    //                     for (let i = 0; i < 16; i++) {
    //                         const chunk = data.slice(i * chunkSize, (i + 1) * chunkSize);
    //                         if (chunk.length === chunkSize) {
    //                             public_inputs.push("0x"+chunk);
    //                         }
    //                     }

    //                     // Ostatak podataka
    //                 const remaining = data.slice(16 * chunkSize);
    //                 const hexArray = remaining.match(/.{1,2}/g);

    //                 uint8Array = new Uint8Array(hexArray.map(h => parseInt(h, 16)));
    //                 } catch (err) {
    //                     //console.error("Greška pri čitanju fajla:", err);
    //                 }
    //                 console.log("adasdsadsa");
    //                 //console.log(public_inputs);
    //                 //console.log(uint8Array);
    //                 const mainProofArtifacts = await backend.generateRecursiveProofArtifacts(
    //                     { publicInputs: public_inputs, proof: uint8Array},
    //                     public_inputs.length
    //                 );
    //                 console.log("dasdsadasdsadasasd");
                    
    //                 await backend.destroy();
    //                 console.log("Backend uništen");
    //                 const script2 = spawn('./aes_rec.sh',[JSON.stringify(mainProofArtifacts),public_inputs,2]);
    //                 console.log("aaa");
    //                 } else {
    //                     console.log(`druga_skripta.sh završena sa kodom: ${code2}`);
    //                 }
    //             });

    //         } catch (err) {
    //             //console.log(err);
    //         }
    //     } else {
    //         console.log(`Skripta je završena sa kodom: ${code}`);
    //     }
    // });
// }
aes().then(()=>process.exit());