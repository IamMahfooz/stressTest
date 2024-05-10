export default function Navbar(){
    return <nav className="nav">
        <a href="/" className="site-title">Stress-Test</a>
        <ul>
            <li className="active">
                <a href="/stresstest">Stress-Test</a>
            </li>
            <li>
                <a href="/status">Status</a>
            </li>
            <li>
                <a href="/login">Login</a>
            </li>
        </ul>
    </nav>
}