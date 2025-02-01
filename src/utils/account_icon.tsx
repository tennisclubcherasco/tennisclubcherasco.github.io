import { FaUserCircle } from "react-icons/fa"

const AccountIcon = ({ size, color }: { size: number, color: string }) => {
    return (
            <FaUserCircle style={{
                width: size + 'px',
                height:'auto',
                backgroundColor: color,
                color: 'white',
                objectFit: 'scale-down',
                border: 'solid',
                borderWidth: '5px',
                borderRadius: '50%',
                borderColor: color }}
            />
    )
}

export default AccountIcon;