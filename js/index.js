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
    let res = await verifyProof(compiledMain, proof, mainPublicInputs);
    console.log(res);

    log('Generating recursive proof 1...')
    const { proof: rec1Proof, artifacts: rec1Artifacts, publicInputs: recPublicInputs} = await generateRecursiveProof(compiledRec1, mainPublicInputs, mainArtifacts, { c: 3 });
    log('Recursive proof 1 generated');

    console.log(recPublicInputs)
    res = await verifyProof(compiledRec1, rec1Proof, recPublicInputs);
    console.log(res);

    log('Generating recursive proof 2...')
    const { proof: rec2Proof, artifacts: rec2Artifacts, publicInputs: rec2PublicInputs} = await generateRecursiveProof(compiledRec2, recPublicInputs, rec1Artifacts, { d: 4 });
    log('Recursive proof 2 generated');
    
    console.log(rec2PublicInputs);
    res = await verifyProof(compiledRec2, rec2Proof, rec2PublicInputs);
    console.log(res);

    log('Generating recursive proof 3...')
    const { proof: rec3Proof, artifacts: rec3Artifacts, publicInputs: rec3PublicInputs} = await generateRecursiveProof(compiledRec2, rec2PublicInputs, rec2Artifacts, { d: 4 });
    log('Recursive proof 3 generated');
    
    console.log(rec3PublicInputs);
    res = await verifyProof(compiledRec2, rec3Proof, rec3PublicInputs);
    console.log(res);

    log('Generating recursive proof 4...')
    const { proof: rec4Proof, artifacts: rec4Artifacts, publicInputs: rec4PublicInputs} = await generateRecursiveProof(compiledRec2, rec3PublicInputs, rec3Artifacts, { d: 4 });
    log('Recursive proof 4 generated');
    
    console.log(rec4PublicInputs);
    res = await verifyProof(compiledRec2, rec4Proof, rec4PublicInputs);
    console.log(res);

    log('Generating recursive proof 5...')
    const { proof: rec5Proof, artifacts: rec5Artifacts, publicInputs: rec5PublicInputs} = await generateRecursiveProof(compiledRec2, rec4PublicInputs, rec4Artifacts, { d: 4 });
    log('Recursive proof 5 generated');
    
    console.log(rec5PublicInputs);
    res = await verifyProof(compiledRec2, rec5Proof, rec5PublicInputs);
    console.log(res);

    log('Generating recursive proof 6...')
    const { proof: rec6Proof, artifacts: rec6Artifacts, publicInputs: rec6PublicInputs} = await generateRecursiveProof(compiledRec2, rec5PublicInputs, rec5Artifacts, { d: 4 });
    log('Recursive proof 6 generated');
    
    console.log(rec6PublicInputs);
    res = await verifyProof(compiledRec2, rec6Proof, rec6PublicInputs);
    console.log(res);

    log('Generating recursive proof 7...')
    const { proof: rec7Proof, artifacts: rec7Artifacts, publicInputs: rec7PublicInputs} = await generateRecursiveProof(compiledRec2, rec6PublicInputs, rec6Artifacts, { d: 4 });
    log('Recursive proof 7 generated');
    
    console.log(rec7PublicInputs);
    res = await verifyProof(compiledRec2, rec7Proof, rec7PublicInputs);
    console.log(res);

    log('Generating recursive proof 8...')
    const { proof: rec8Proof, artifacts: rec8Artifacts, publicInputs: rec8PublicInputs} = await generateRecursiveProof(compiledRec2, rec7PublicInputs, rec7Artifacts, { d: 4 });
    log('Recursive proof 8 generated');
    
    console.log(rec8PublicInputs);
    res = await verifyProof(compiledRec2, rec8Proof, rec8PublicInputs);
    console.log(res);

    log('Generating recursive proof 9...')
    const { proof: rec9Proof, artifacts: rec9Artifacts, publicInputs: rec9PublicInputs} = await generateRecursiveProof(compiledRec2, rec8PublicInputs, rec8Artifacts, { d: 4 });
    log('Recursive proof 9 generated');
    
    console.log(rec9PublicInputs);
    res = await verifyProof(compiledRec2, rec9Proof, rec9PublicInputs);
    console.log(res);

    log('Generating recursive proof 10...')
    const { proof: rec10Proof, artifacts: rec10Artifacts, publicInputs: rec10PublicInputs} = await generateRecursiveProof(compiledRec2, rec9PublicInputs, rec9Artifacts, { d: 4 });
    log('Recursive proof 10 generated');
    
    console.log(rec10PublicInputs);
    res = await verifyProof(compiledRec2, rec10Proof, rec10PublicInputs);
    console.log(res);
}

main().then(() => process.exit());