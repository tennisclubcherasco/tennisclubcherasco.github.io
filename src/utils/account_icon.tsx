import { FaUserCircle } from "react-icons/fa"

const AccountIcon = ({ size }: { size: number }) => {
    return (
            <FaUserCircle style={{
                width: size + 'px',
                height:'auto',
                backgroundColor: '#2f7157',
                color: 'white',
                objectFit: 'scale-down',
                border: 'solid',
                borderWidth: '5px',
                borderRadius: '50%',
                borderColor: '#2f7157' }}
            />
    )
}

export default AccountIcon;