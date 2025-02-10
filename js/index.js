import { getCircuit, log, generateProof, generateRecursiveProof, verifyProof } from "./utils.js";

const main = async () => {
    // Compile circuits
    log('Compiling circuits...');
    const compiledMain = await getCircuit('addition_main');
    const compiledRec1 = await getCircuit('addition_rec_1');
    const compiledRec2 = await getCircuit('addition_rec_2');
    const compiledRec3 = await getCircuit('addition_rec_3');
    log('Circuits compiled!');

    const pt = [0x00,0x11,0x22,0x33,0x44,0x55,0x66,0x77,0x88,0x99,0xaa,0xbb,0xcc,0xdd,0xee,0xff];
    const key = [0x00,0x01,0x02,0x03,0x04,0x05,0x06,0x07,0x08,0x09,0x0a,0x0b,0x0c,0x0d,0x0e,0x0f];

    // Generate main proof
    log('Generating main proof and recursive artifacts...')
    const { 
        proof, 
        publicInputs: mainPublicInputs, 
        artifacts: mainArtifacts 
    } = await generateProof(compiledMain, { pt:pt,key:key,i:0 });
    log('Main proof and recursive artifacts generated');

    console.log(mainPublicInputs);
    let res = await verifyProof(compiledMain, proof, mainPublicInputs);
    console.log(res);
    let i=1;
    log('Generating recursive proof 1...')
    const { proof: rec1Proof, artifacts: rec1Artifacts, publicInputs: recPublicInputs} = await generateRecursiveProof(compiledRec1, mainPublicInputs, mainArtifacts, {key:key,i:i});
    log('Recursive proof 1 generated');
    i++;

    console.log(recPublicInputs)
    res = await verifyProof(compiledRec1, rec1Proof, recPublicInputs);
    console.log(res);

    log('Generating recursive proof 2...')
    const { proof: rec2Proof, artifacts: rec2Artifacts, publicInputs: rec2PublicInputs} = await generateRecursiveProof(compiledRec2, recPublicInputs, rec1Artifacts, { key:key,i:i});
    log('Recursive proof 2 generated');
    i++;
    
    console.log(rec2PublicInputs);
    res = await verifyProof(compiledRec2, rec2Proof, rec2PublicInputs);
    console.log(res);

    log('Generating recursive proof 3...')
    const { proof: rec3Proof, artifacts: rec3Artifacts, publicInputs: rec3PublicInputs} = await generateRecursiveProof(compiledRec2, rec2PublicInputs, rec2Artifacts, { key:key,i:i});
    log('Recursive proof 3 generated');
    i++;
    
    console.log(rec3PublicInputs);
    res = await verifyProof(compiledRec2, rec3Proof, rec3PublicInputs);
    console.log(res);

    log('Generating recursive proof 4...')
    const { proof: rec4Proof, artifacts: rec4Artifacts, publicInputs: rec4PublicInputs} = await generateRecursiveProof(compiledRec2, rec3PublicInputs, rec3Artifacts, { key:key,i:i});
    log('Recursive proof 4 generated');
    i++;
    
    console.log(rec4PublicInputs);
    res = await verifyProof(compiledRec2, rec4Proof, rec4PublicInputs);
    console.log(res);

    log('Generating recursive proof 5...')
    const { proof: rec5Proof, artifacts: rec5Artifacts, publicInputs: rec5PublicInputs} = await generateRecursiveProof(compiledRec2, rec4PublicInputs, rec4Artifacts, { key:key,i:i});
    log('Recursive proof 5 generated');
    i++;
    
    console.log(rec5PublicInputs);
    res = await verifyProof(compiledRec2, rec5Proof, rec5PublicInputs);
    console.log(res);

    log('Generating recursive proof 6...')
    const { proof: rec6Proof, artifacts: rec6Artifacts, publicInputs: rec6PublicInputs} = await generateRecursiveProof(compiledRec2, rec5PublicInputs, rec5Artifacts, { key:key,i:i});
    log('Recursive proof 6 generated');
    i++;
    
    console.log(rec6PublicInputs);
    res = await verifyProof(compiledRec2, rec6Proof, rec6PublicInputs);
    console.log(res);

    log('Generating recursive proof 7...')
    const { proof: rec7Proof, artifacts: rec7Artifacts, publicInputs: rec7PublicInputs} = await generateRecursiveProof(compiledRec2, rec6PublicInputs, rec6Artifacts, { key:key,i:i});
    log('Recursive proof 7 generated');
    i++;
    
    console.log(rec7PublicInputs);
    res = await verifyProof(compiledRec2, rec7Proof, rec7PublicInputs);
    console.log(res);

    log('Generating recursive proof 8...')
    const { proof: rec8Proof, artifacts: rec8Artifacts, publicInputs: rec8PublicInputs} = await generateRecursiveProof(compiledRec2, rec7PublicInputs, rec7Artifacts, { key:key,i:i});
    log('Recursive proof 8 generated');
    i++;
    
    console.log(rec8PublicInputs);
    res = await verifyProof(compiledRec2, rec8Proof, rec8PublicInputs);
    console.log(res);
    //10 round
    log('Generating recursive proof 9...')
    const { proof: rec9Proof, artifacts: rec9Artifacts, publicInputs: rec9PublicInputs} = await generateRecursiveProof(compiledRec3, rec8PublicInputs, rec8Artifacts, { key:key,i:i});
    log('Recursive proof 9 generated');
    i++;
    
    console.log(rec9PublicInputs);
    res = await verifyProof(compiledRec3, rec9Proof, rec9PublicInputs);
    console.log(res);

    // log('Generating recursive proof 10...')
    // const { proof: rec10Proof, artifacts: rec10Artifacts, publicInputs: rec10PublicInputs} = await generateRecursiveProof(compiledRec2, rec9PublicInputs, rec9Artifacts, { d: 4 });
    // log('Recursive proof 10 generated');
    
    // console.log(rec10PublicInputs);
    // res = await verifyProof(compiledRec2, rec10Proof, rec10PublicInputs);
    // console.log(res);
}

main().then(() => process.exit());