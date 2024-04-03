from Crypto.Cipher import DES
from Crypto.Random import get_random_bytes

 

def des_encrypt(key, plaintext):
    cipher = DES.new(key, DES.MODE_ECB)
    ciphertext = cipher.encrypt(plaintext)
    return ciphertext

 

def des_decrypt(key, ciphertext):
    cipher = DES.new(key, DES.MODE_ECB)
    decrypted_message = cipher.decrypt(ciphertext)
    return decrypted_message

 

# Generate a random 8-byte key for DES
key = get_random_bytes(8)

 

# Get the message from the user
message = input("Enter the message to encrypt (must be a multiple of 8 bytes): ").encode()

 

print("Message:", message)
# Initial encryption
ciphertext_round1 = des_encrypt(key, message)
print("Round 1 Encrypted:", ciphertext_round1)

 

# Second encryption using the output of the first round
ciphertext_round2 = des_encrypt(key, ciphertext_round1)
print("Round 2 Encrypted:", ciphertext_round2)

 

# Decryption in reverse order
decrypted_message_round2 = des_decrypt(key, ciphertext_round2)
print("Round 2 Decrypted:", decrypted_message_round2)

 

decrypted_message_round1 = des_decrypt(key, decrypted_message_round2)
print("Round 1 Decrypted:", decrypted_message_round1)