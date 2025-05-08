import { FirmalarHeader } from '../../components/firmalar/header';
import { FirmalarFooter } from '../../components/firmalar/footer';

export default function FirmalarLayout({ children }) {
    return (
        <>
            <FirmalarHeader />
            {children}
            <FirmalarFooter />
        </>
    );
} 