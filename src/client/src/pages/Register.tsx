import { Box, Button } from '@chakra-ui/react';
import axios from 'axios';
import { Form, Formik } from 'formik';
import { useNavigate } from 'react-router-dom';
import { InputField } from '../components/InputField';
import { Wrapper } from '../components/Wrapper';
import authService from '../services/authService';

const Register = () => {
  const navigate = useNavigate();
  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ email: '', password: '' }}
        onSubmit={async (values, { setErrors }) => {
          const { email, password } = values;
          const res = await authService.register(email, password);

          if (res?.errors && res.errors.length) {
            setErrors({
              email: res.errors[0].message,
            });
          } else {
            localStorage.setItem('token', res.data.token);
            axios.defaults.headers.common[
              'Authorization'
            ] = `Bearer ${res.data.token}`;
            navigate('/posts/plans');
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField name="email" placeholder="email" label="Email" />
            <Box mt={4}>
              <InputField
                name="password"
                placeholder="password"
                label="Password"
                type="password"
              />
            </Box>
            <Button
              mt={4}
              type="submit"
              isLoading={isSubmitting}
              variant="teal"
            >
              Register
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};
export default Register;
