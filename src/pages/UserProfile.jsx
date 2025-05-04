import React from 'react';

const UserProfile = () => {
    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h1>User Profile</h1>
            <p>Welcome to the user profile page!</p>
            <div>
                <h3>Details:</h3>
                <ul>
                    <li>Name: John Doe</li>
                    <li>Email: john.doe@example.com</li>
                    <li>Location: New York, USA</li>
                </ul>
            </div>
        </div>
    );
};

export default UserProfile;