use dep::std;
#[recursive]
fn main(
    verification_key : [Field; 114], 
    proof : [Field; 93], 
    public_inputs : [Field; 33], 
    key_hash : Field,
    d: pub Field
) -> pub [Field; 16] {
    std::verify_proof(
        verification_key.as_slice(), 
        proof.as_slice(), 
        public_inputs.as_slice(), 
        key_hash,
    );

    let mut asd=field_array_to_u8_array(public_inputs);
    asd
}

pub fn field_array_to_u8_array(input: [Field; 33]) -> [Field; 16] {
    let mut result: [Field; 16] = [0; 16];
    for a in 0..16 {
        result[a] = input[a+1];
    }
    result
}