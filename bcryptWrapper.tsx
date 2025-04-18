import { Platform } from 'react-native';

let bcrypt: typeof import('bcryptjs');

if (Platform.OS === 'web') {
    bcrypt = require('bcryptjs');
} else {
    bcrypt = {
        hashSync: () => {
            throw new Error('bcryptjs is not supported on native platforms.');
        },
        compareSync: () => {
            throw new Error('bcryptjs is not supported on native platforms.');
        },
        genSaltSync: () => {
            throw new Error('bcryptjs is not supported on native platforms.');
        },
    };
}

export default bcrypt;
