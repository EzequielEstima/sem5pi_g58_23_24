using System.Security.Cryptography;

namespace MDTarefas.utils
{
    public static class RandomHexStringGenerator
    {
        public static string GenerateRandomHex(int length)
        {
            if (length <= 0)
            {
                throw new ArgumentException("Length must be greater than zero.", nameof(length));
            }

            byte[] randomBytes = new byte[length / 2]; // Each byte represents two hex characters

            using (RandomNumberGenerator rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(randomBytes);
            }

            return BitConverter.ToString(randomBytes).Replace("-", "").Substring(0, length);
        }
    }
}

