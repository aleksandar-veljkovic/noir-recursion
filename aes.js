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
    const fm = createFileManager(path.join(__dirname, 'build'));
    const nr = fs.createReadStream(`./${name}/src/main.nr`, 'utf8');
    await fm.writeFile('./src/main.nr', createReadableStreamFromReadable(nr));

    const nargoToml = fs.createReadStream(`./${name}/Nargo.toml`, 'utf8');
    await fm.writeFile('./Nargo.toml', createReadableStreamFromReadable(nargoToml));

    const result = await compile(fm);
    if (!('program' in result)) {
        throw new Error('Compilation failed');
    }

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
        let { stdout } = await execFileAsync('./aes.sh');
        
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
            return;
        }

        const mainProofArtifacts = await backend.generateRecursiveProofArtifacts(
            { publicInputs: public_inputs, proof: uint8Array },
            public_inputs.length
        );

        await backend.destroy();

        let { stdout: stdout2 } = await execFileAsync('./aes_rec.sh', [JSON.stringify(mainProofArtifacts), public_inputs]);
        
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
            return;
        }
        let RecProofArtifacts = await backend.generateRecursiveProofArtifacts(
            { publicInputs: public_inputs, proof: uint8Array },
            public_inputs.length
        );

        await backend.destroy();
        let i = 2;
        let { stdout: stdout3 } = await execFileAsync('./aes_recursion.sh', [JSON.stringify(RecProofArtifacts), public_inputs, i]);
        i++;
        
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
            return;
        }

        RecProofArtifacts = await backend.generateRecursiveProofArtifacts(
            { publicInputs: public_inputs, proof: uint8Array },
            public_inputs.length
        );

        await backend.destroy();
        let { stdout: stdout4 } = await execFileAsync('./aes_recursion.sh', [JSON.stringify(RecProofArtifacts), public_inputs, i]);
        i++;
        
        data_json = await readResult('./aes_recursion/recursion.json');
        public_inputs = [data_json.i, ...data_json.return];
        
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
            return;
        }

        RecProofArtifacts = await backend.generateRecursiveProofArtifacts(
            { publicInputs: public_inputs, proof: uint8Array },
            public_inputs.length
        );

        await backend.destroy();
        let { stdout: stdout5 } = await execFileAsync('./aes_recursion.sh', [JSON.stringify(RecProofArtifacts), public_inputs, i]);
        i++;
        
        data_json = await readResult('./aes_recursion/recursion.json');
        public_inputs = [data_json.i, ...data_json.return];
        
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
            return;
        }

        RecProofArtifacts = await backend.generateRecursiveProofArtifacts(
            { publicInputs: public_inputs, proof: uint8Array },
            public_inputs.length
        );

        await backend.destroy();
        let { stdout: stdout6 } = await execFileAsync('./aes_recursion.sh', [JSON.stringify(RecProofArtifacts), public_inputs, i]);
        i++;
        
        data_json = await readResult('./aes_recursion/recursion.json');
        public_inputs = [data_json.i, ...data_json.return];
        
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
            return;
        }

        RecProofArtifacts = await backend.generateRecursiveProofArtifacts(
            { publicInputs: public_inputs, proof: uint8Array },
            public_inputs.length
        );

        await backend.destroy();
        let { stdout: stdout7 } = await execFileAsync('./aes_recursion.sh', [JSON.stringify(RecProofArtifacts), public_inputs, i]);
        i++;
        
        data_json = await readResult('./aes_recursion/recursion.json');
        public_inputs = [data_json.i, ...data_json.return];
        
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
            return;
        }

        RecProofArtifacts = await backend.generateRecursiveProofArtifacts(
            { publicInputs: public_inputs, proof: uint8Array },
            public_inputs.length
        );

        await backend.destroy();
        let { stdout: stdout8 } = await execFileAsync('./aes_recursion.sh', [JSON.stringify(RecProofArtifacts), public_inputs, i]);
        i++;
        
        data_json = await readResult('./aes_recursion/recursion.json');
        public_inputs = [data_json.i, ...data_json.return];
    
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
            return;
        }

        RecProofArtifacts = await backend.generateRecursiveProofArtifacts(
            { publicInputs: public_inputs, proof: uint8Array },
            public_inputs.length
        );

        await backend.destroy();
        let { stdout: stdout9 } = await execFileAsync('./aes_recursion.sh', [JSON.stringify(RecProofArtifacts), public_inputs, i]);
        i++;
        
        data_json = await readResult('./aes_recursion/recursion.json');
        public_inputs = [data_json.i, ...data_json.return];
    
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
            return;
        }

        RecProofArtifacts = await backend.generateRecursiveProofArtifacts(
            { publicInputs: public_inputs, proof: uint8Array },
            public_inputs.length
        );

        await backend.destroy();
        let { stdout: stdout10 } = await execFileAsync('./aes_10_round.sh', [JSON.stringify(RecProofArtifacts), public_inputs, i]);
        i++;
        
    } catch (error) {
        console.error(`Greška u izvršavanju skripti: ${error.message}`);
    }
}
aes().then(()=>process.exit());