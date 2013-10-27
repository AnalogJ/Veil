Veil
====

Angular Application that allows you to securely encrypt and retrieve your SSH keys from Dropbox storage. 

Ideas
====

- __NOTHING__ should ever be uploaded to the nodejs server. Everything should either exist locally, or stored in the Dropbox datastore (encrypted of course)
- Should allow you to generate a new private pem master cert (and force you to save it locally with or without a passphrase)
- Should allow you to select an existing (encrypted) pem master cert that exists locally
- Should show you the strength of any passphrase that is entered. 
- Should allow users to add passphrases to any certificate they upload to dropbox
- Should use dropbox datastore with limited permisions

Options
====

- How should the certificates be stored? 
  - Store the encrypted content in the datastore
  - Store the encrypted content as encrypted flat files in dropbox so that in case of a huge failure the certificates could be decrypted manually
- Can the user have multiple master keys?
  - If so, then determine a way to figure out which certificates were encrypted with which master key, possibly using an MD5 hash of the public key?
    - this information seems to be embedded in the encrypted document in plain text. http://security.stackexchange.com/questions/25170/what-information-is-leaked-from-an-openpgp-encrypted-file
