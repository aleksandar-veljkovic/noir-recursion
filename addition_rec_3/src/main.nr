use dep::std;
use dep::aes;
#[recursive]
fn main(
    //verification_key : [Field; 114], 
    //proof : [Field; 93], 
    public_inputs : [Field; 16], 
    //key_hash : Field,
    key: [u8;16],
    i: Field
) ->pub [u8;16] {
    // std::verify_proof(
    //     verification_key.as_slice(), 
    //     proof.as_slice(), 
    //     public_inputs.as_slice(), 
    //     key_hash,
    // );
    let ct= [105, 196, 224, 216, 106, 123, 4, 48, 216, 205, 183, 128, 112, 180, 197, 90];
    let mut state = field_array_to_u8_array(public_inputs);
    let key_schedule = aes::aes_128_key_schedule(key);
    state = aes::aes_add_key_layer(state, key_schedule[i]);
    state = aes::aes_sbox_layer(state);
    state = aes::aes_shift_rows_layer(state);
    state = aes::aes_add_key_layer(state,key_schedule[10]);
    //assert(i==public_inputs[0]+1);
    //assert(ct == state);
    state
}

fn field_array_to_u8_array(input: [Field; 16]) -> [u8; 16] {
    let mut result: [u8; 16] = [0; 16];
    for i in 0..16 {
        result[i] = input[i] as u8;
    }
    result
}