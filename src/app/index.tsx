import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
import { PhoneAuthProvider, signInWithCredential } from 'firebase/auth';
import { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { auth } from '../firebase'; // Adjust path if necessary (e.g., '../firebase')

const firebaseConfig = {
  apiKey: "AIzaSyBn54S_rfdXuKGjBves9Ba0O9iJge8N2d0",
  authDomain: "expo-otp-auth-134fc.firebaseapp.com",
  projectId: "expo-otp-auth-134fc",
  storageBucket: "expo-otp-auth-134fc.firebasestorage.app",
  messagingSenderId: "678821808797",
  appId: "1:678821808797:web:10e6f2cc908f7429eb2274"
};

export default function PhoneAuthScreen() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationId, setVerificationId] = useState<string | null>(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<'success' | 'failure' | null>(null);

  const recaptchaVerifier = useRef<any>(null);

  const handleSendOtp = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      Alert.alert('Error', 'Please enter a valid phone number with country code (e.g., +1234567890)');
      return;
    }

    setLoading(true);
    setVerificationStatus(null);

    try {
      const phoneProvider = new PhoneAuthProvider(auth);
      const vid = await phoneProvider.verifyPhoneNumber(
        phoneNumber,
        recaptchaVerifier.current
      );
      setVerificationId(vid);
      Alert.alert('Success', 'OTP has been sent to your phone number!');
    } catch (err: any) {
      Alert.alert('OTP Request Failed', err.message);
      setVerificationStatus('failure');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!verificationCode || verificationCode.length < 6) {
      Alert.alert('Error', 'Please enter a valid 6-digit OTP.');
      return;
    }

    setLoading(true);

    try {
      const credential = PhoneAuthProvider.credential(
        verificationId!,
        verificationCode
      );
      await signInWithCredential(auth, credential);
      setVerificationStatus('success');
    } catch (err: any) {
      setVerificationStatus('failure');
      Alert.alert('Verification Failed', 'Invalid OTP code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setVerificationId(null);
    setVerificationCode('');
    setVerificationStatus(null);
    setPhoneNumber('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.inner}
      >
        <FirebaseRecaptchaVerifierModal
          ref={recaptchaVerifier}
          firebaseConfig={firebaseConfig}
          attemptInvisibleVerification={true}
        />

        <Text style={styles.title}>Phone Verification</Text>

        {!verificationId ? (
          <View style={styles.card}>
            <Text style={styles.label}>Enter Phone Number (with country code):</Text>
            <TextInput
              style={styles.input}
              placeholder="+1 234 567 8900"
              placeholderTextColor="#A0AEC0"
              keyboardType="phone-pad"
              autoComplete="tel"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              editable={!loading}
            />
            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleSendOtp}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.buttonText}>Send OTP</Text>
              )}
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.card}>
            <Text style={styles.label}>Enter 6-digit OTP sent to {phoneNumber}:</Text>
            <TextInput
              style={styles.input}
              placeholder="123456"
              placeholderTextColor="#A0AEC0"
              keyboardType="number-pad"
              maxLength={6}
              value={verificationCode}
              onChangeText={setVerificationCode}
              editable={!loading}
            />
            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleVerifyOtp}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.buttonText}>Verify OTP</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity onPress={handleReset} style={styles.linkButton}>
              <Text style={styles.linkText}>Change Phone Number</Text>
            </TouchableOpacity>
          </View>
        )}

        {verificationStatus === 'success' && (
          <View style={[styles.statusBanner, styles.successBanner]}>
            <Text style={styles.statusText}>✅ Phone number verified successfully!</Text>
          </View>
        )}
        {verificationStatus === 'failure' && (
          <View style={[styles.statusBanner, styles.failureBanner]}>
            <Text style={styles.statusText}>❌ Verification failed. Incorrect OTP.</Text>
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  inner: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1A202C',
    textAlign: 'center',
    marginBottom: 32,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4A5568',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#CBD5E0',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: '#2D3748',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#3182CE',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#A0AEC0',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  linkButton: {
    marginTop: 14,
    alignItems: 'center',
  },
  linkText: {
    color: '#3182CE',
    fontSize: 14,
  },
  statusBanner: {
    marginTop: 24,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  successBanner: {
    backgroundColor: '#C6F6D5',
    borderColor: '#38A169',
    borderWidth: 1,
  },
  failureBanner: {
    backgroundColor: '#FED7D7',
    borderColor: '#E53E3E',
    borderWidth: 1,
  },
  statusText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A202C',
  },
});