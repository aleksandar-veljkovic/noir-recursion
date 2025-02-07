use dep::std;
#[recursive]
fn main(
    verification_key : [Field; 114], 
    proof : [Field; 93], 
    public_inputs : [Field; 51], 
    key_hash : Field,
    d: pub Field
) -> pub [Field; 51] {
    std::verify_proof(
        verification_key.as_slice(), 
        proof.as_slice(), 
        public_inputs.as_slice(), 
        key_hash,
    );

    public_inputs
}