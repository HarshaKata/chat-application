// import { useState, useEffect, useContext } from 'react';

// import { Box, styled, Divider } from '@mui/material';

// import { AccountContext } from '../../../context/AccountProvider';

// //components
// import Conversation from './Conversation';
// import { getUsers } from '../../../service/api';

// const Component = styled(Box)`
//     overflow: overlay;
//     height: 81vh;
// `;

// const StyledDivider = styled(Divider)`
//     margin: 0 0 0 70px;
//     background-color: #e9edef;
//     opacity: .6;
// `;

// const Conversations = ({ text }) => {
//     const [users, setUsers] = useState([]);
    
//     const { account, socket, setActiveUsers } = useContext(AccountContext);

//     useEffect(() => {
//         const fetchData = async () => {
//             let data = await getUsers();
//             let fiteredData = data.filter(user => user.name.toLowerCase().includes(text.toLowerCase()));
//             setUsers(fiteredData);
//         }
//         fetchData();
//     }, [text]);

//     useEffect(() => {
//         socket.current.emit('addUser', account);
//         socket.current.on("getUsers", users => {
//             setActiveUsers(users);
//         })
//     }, [account])

//     return (
//         <Component>
//             {
//                 users && users.map((user, index) => (
//                     user.sub !== account.sub && 
//                         <>
//                             <Conversation user={user} />
//                             {
//                                 users.length !== (index + 1)  && <StyledDivider />
//                             }
//                         </>
//                 ))
//             }
//         </Component>
//     )
// }

// export default Conversations;

import { useState, useEffect, useContext } from 'react';
import { Box, styled, Divider } from '@mui/material';
import { AccountContext } from '../../../context/AccountProvider';
import Conversation from './Conversation';
import { getUsers } from '../../../service/api';

const Component = styled(Box)`
    overflow: overlay;
    height: 81vh;
`;

const StyledDivider = styled(Divider)`
    margin: 0 0 0 70px;
    background-color: #e9edef;
    opacity: .6;
`;

const Conversations = ({ text }) => {
    const [users, setUsers] = useState([]);
    const { account, socket, setActiveUsers } = useContext(AccountContext);

    useEffect(() => {
        const fetchData = async () => {
            try {
                let data = await getUsers();
                // Ensure data is valid and is an array
                if (data && Array.isArray(data)) {
                    let filteredData = data.filter(user => 
                        user.name && user.name.toLowerCase().includes(text.toLowerCase())
                    );
                    setUsers(filteredData);
                } else {
                    console.error("getUsers did not return an array", data);
                    setUsers([]); // Handle invalid data gracefully
                }
            } catch (error) {
                console.error("Error fetching users:", error);
                setUsers([]); // Handle error by setting users to an empty array
            }
        };
        fetchData();
    }, [text]);

    useEffect(() => {
        socket.current.emit('addUser', account);
        socket.current.on("getUsers", users => {
            setActiveUsers(users);
        });
    }, [account, socket, setActiveUsers]);

    return (
        <Component>
            {
                users && users.map((user, index) => (
                    user.sub !== account.sub && 
                        <div key={user.sub || index}>
                            <Conversation user={user} />
                            { users.length !== (index + 1) && <StyledDivider /> }
                        </div>
                ))
            }
        </Component>
    );
}

export default Conversations;
