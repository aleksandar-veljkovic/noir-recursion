import { getCircuit, log, generateProof, generateRecursiveProof, verifyProof } from "./utils.js";

const main = async () => {
    // Compile circuits
    log('Compiling circuits...');
    const compiledMain = await getCircuit('addition_main');
    const compiledRec1 = await getCircuit('addition_rec_1');
    const compiledRec2 = await getCircuit('addition_rec_2');
    log('Circuits compiled!');

    // Generate main proof
    log('Generating main proof and recursive artifacts...')
    const { 
        proof, 
        publicInputs: mainPublicInputs, 
        artifacts: mainArtifacts 
    } = await generateProof(compiledMain, { x: 1, y: 2, z: 3 });
    log('Main proof and recursive artifacts generated');
    console.log(mainPublicInputs);

    log('Generating recursive proof 1...')
    const { proof: rec1Proof, artifacts: rec1Artifacts, publicInputs: recPublicInputs} = await generateRecursiveProof(compiledRec1, mainPublicInputs, mainArtifacts, { c: 3 });
    log('Recursive proof 1 generated');

    console.log(recPublicInputs)

    log('Generating recursive proof 2...')
    const { proof: rec2Proof, artifacts: rec2Artifacts, publicInputs: rec2PublicInputs} = await generateRecursiveProof(compiledRec2, recPublicInputs, rec1Artifacts, { d: 4 });
    log('Recursive proof 2 generated');
    
    console.log(rec2PublicInputs);

    log('Generating recursive proof 3...')
    const { proof: rec3Proof, artifacts: rec3Artifacts, publicInputs: rec3PublicInputs} = await generateRecursiveProof(compiledRec2, rec2PublicInputs, rec2Artifacts, { d: 4 });
    log('Recursive proof 3 generated');
    
    console.log(rec3PublicInputs);

    const res = await verifyProof(compiledRec2, rec3Proof, rec3PublicInputs);
    console.log(res);
}

main().then(() => process.exit());