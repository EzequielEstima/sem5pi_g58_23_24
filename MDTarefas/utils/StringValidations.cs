using System.Text.RegularExpressions;

namespace MDTarefas.utils
{
    public static class StringValidations
    {
        public static bool isNullEmptyOrBlank(this string? str) {
            return str == null || str == "" || str.Trim() == "";
        }

        public static bool isAlphanumericOrWhiteSpace(string str) {
            Regex regex = new Regex("^[a-zA-Z0-9 ]*$");
            return regex.IsMatch(str);
        }

        public static bool isNumeric(string str) {
            Regex regex = new Regex("^[0-9]*$");
            return regex.IsMatch(str);
        }

        public static bool hasLengthLessOrEqualTo(string str, int len) {
            return str.Length <= len;
        }

        public static bool hasLengthBetweenOrEqualTo(string str, int minLen, int maxLen) {
            return str.Length >= minLen && str.Length <= maxLen;
        }
    }
}