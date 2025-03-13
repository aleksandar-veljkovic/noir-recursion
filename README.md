# AES-128 Recursive Implementation with JavaScript & Noir

## Overview
This project contains an implementation of the AES-128 algorithm using JavaScript and Noir, with an emphasis on a recursive approach. The primary goal is to demonstrate how a standard cryptographic algorithm can be implemented in an unconventional way by using recursion to handle key transformations. The project is designed as an educational tool and also aims to provide efficient and modular code.

## Contents
- [Overview](#overview)
- [Motivation](#motivation)
- [Specifications and Goals](#specifications-and-goals)
- [AES-128 Theory](#aes-128-theory)
- [Recursive Approach](#recursive-approach)
- [Installation](#installation)
- [Usage](#usage)
- [Contribution and Future Work](#contribution-and-future-work)
- [References](#references)
- [License](#license)
- [Contact](#contact)

## Motivation
The goal of this project is to:
- **Experiment with Recursion:** Instead of using a traditional iterative approach, the implementation employs recursion for each round of the AES-128 algorithm.
- **Language Integration:** Combining JavaScript and Noir leverages the strengths of both languages. JavaScript provides flexibility and broad support, while Noir offers an elegant way to express specific cryptographic operations.
- **Education:** This project is designed as an educational tool for developers who want to understand the intricacies of the AES algorithm and explore alternative implementation approaches.

## Specifications and Goals
- **Algorithm:** AES-128, a symmetric block cipher.
- **Key Transformations:** SubBytes, ShiftRows, MixColumns, and AddRoundKey.
- **Recursive Design:** Each encryption round is processed through recursive function calls, contributing to modularity and an easier understanding of data flow.
- **Integration of the Noir Module:** Key functions are implemented in the Noir language and then integrated into the JavaScript environment.
- **Security and Performance:** Although the primary aim is demonstration, the code is designed to adhere to the recommendations and standards of the AES-128 algorithm.

## AES-128 Theory
AES-128 is used to encrypt data with a 128-bit key. The main steps of the algorithm are:
- **SubBytes:** Replacing each byte using an S-box to provide non-linearity.
- **ShiftRows:** Shifting the rows of the matrix for additional diffusion.
- **MixColumns:** Combining the columns using a linear transformation.
- **AddRoundKey:** Performing an XOR operation between the current state and a portion of the expanded key.

Implementing these steps ensures a high level of security and resistance to various attacks.

## Recursive Approach
Instead of using a traditional loop to perform rounds, this project uses recursion:
- **Simplified Code:** Each encryption round calls itself until the final round is reached.
- **Modularity:** The recursive approach allows the problem to be broken down into smaller, more understandable functions.
- **Educational Value:** It demonstrates how complex algorithms can be transformed into elegant recursive structures.

## Installation

### Prerequisites

- **Node.js:** Recommended version 14.x or later. You can download Node.js from the [official website](https://nodejs.org/).
- **Noir Environment:** Install and configure Noir according to the [Noir documentation](https://noir-lang.org/docs/getting_started/noir_installation). It is recommended to use the `noirup` tool to install Nargo, which simplifies the process of downloading binary files or compiling from source.

### Installation Steps

1. **Clone the repository:**

    ```bash
    git clone https://github.com/aleksandar-veljkovic/noir-recursion.git
    ```

2. **Navigate to the project directory and switch to the appropriate branch:**

    ```bash
    cd noir-recursion
    git checkout aes-128-recursive
    ```

3. **Install the required dependencies:**

    ```bash
    npm install
    ```

## Usage

### Basic Operations

- **Encryption:** Converting plain text into ciphertext using the AES-128 algorithm.

### Encryption

To encrypt text, use the following command:

```bash
node aes.js
```

## Contribution and Future Work

We invite everyone interested to contribute to this project. If you have suggestions, discover bugs, or want to add new features, feel free to open an issue or submit a pull request.

**Planned Development:**

- Further optimization of recursive functions.
- Implementation of additional AES variants (AES-192, AES-256).
- Development of a graphical user interface (GUI) for visualizing the encryption and decryption process.

## References

- [AES Specification (FIPS-197)](https://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.197.pdf)
- [Noir Documentation](https://github.com/noir-lang/noir)

## Contact

For additional information, questions, or suggestions, you can contact me via the following channels:

- **GitHub:** [Stefan-Mitrovic](https://github.com/cefika)
