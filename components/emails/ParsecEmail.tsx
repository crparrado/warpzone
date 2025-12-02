import * as React from 'react';
import {
    Body,
    Container,
    Head,
    Heading,
    Html,
    Preview,
    Section,
    Text,
    Button,
    Hr,
} from '@react-email/components';

interface ParsecEmailProps {
    parsecLink: string;
    userName?: string;
    gameName?: string;
}

export const ParsecEmail = ({
    parsecLink,
    userName,
    gameName,
}: ParsecEmailProps) => (
    <Html>
        <Head />
        <Preview>¡Tu PC Gamer está listo! 🎮 Conéctate ahora</Preview>
        <Body style={main}>
            <Container style={container}>
                {/* Header Logo Area */}
                <Section style={headerSection}>
                    <Heading style={logoText}>WARPZONE</Heading>
                    <Text style={subLogoText}>REMOTE GAMING SYSTEMS</Text>
                </Section>

                {/* Main Content */}
                <Section style={contentSection}>
                    <Heading style={title}>¡HORA DE JUGAR!</Heading>
                    <Text style={greeting}>HOLA <span style={neonText}>{userName ? userName.toUpperCase() : 'GAMER'}</span>,</Text>
                    <Text style={paragraph}>
                        Tu sesión {gameName ? `de ${gameName} ` : ''}está lista. Conéctate a tu PC Gamer ahora mismo.
                    </Text>

                    {/* Link Box */}
                    <Section style={linkBox}>
                        <Text style={label}>TU LINK DE CONEXIÓN PARSEC</Text>
                        <Text style={linkText}>{parsecLink}</Text>
                        <Button style={copyButton} href={parsecLink}>
                            ABRIR EN PARSEC
                        </Button>
                    </Section>

                    {/* Instructions */}
                    <Section style={instructionsBox}>
                        <Text style={instructionTitle}>⚠️ INSTRUCCIONES RÁPIDAS</Text>
                        <Text style={instructionText}>
                            1. Si no tienes Parsec, <a href="https://parsec.app/" style={link}>descárgalo aquí</a>.
                        </Text>
                        <Text style={instructionText}>
                            2. Copia el link de arriba y pégalo en la sección "Arcade" o "Computers" de la app.
                        </Text>
                        <Text style={instructionText}>
                            3. ¡Disfruta tu sesión con latencia ultra-baja!
                        </Text>
                    </Section>
                </Section>

                <Hr style={hr} />

                <Text style={footer}>
                    ¿Problemas para conectar? Habla con soporte en nuestro Discord.<br />
                    WARPZONE CHILE
                </Text>
            </Container>
        </Body>
    </Html>
);

// Styles
const main = {
    backgroundColor: '#050505',
    fontFamily: '"Segoe UI", "Roboto", "Helvetica", sans-serif',
    padding: '40px 0',
};

const container = {
    backgroundColor: '#0a0a0a',
    border: '1px solid #333',
    borderRadius: '12px',
    overflow: 'hidden',
    maxWidth: '600px',
    margin: '0 auto',
    boxShadow: '0 0 20px rgba(0, 243, 255, 0.1)',
};

const headerSection = {
    backgroundColor: '#000',
    padding: '30px 0',
    textAlign: 'center' as const,
    borderBottom: '1px solid #333',
};

const logoText = {
    color: '#00f3ff',
    fontSize: '36px',
    fontWeight: '900',
    letterSpacing: '6px',
    margin: '0',
    textShadow: '0 0 10px rgba(0, 243, 255, 0.5)',
};

const subLogoText = {
    color: '#666',
    fontSize: '10px',
    letterSpacing: '4px',
    margin: '5px 0 0',
};

const contentSection = {
    padding: '40px',
    textAlign: 'center' as const,
};

const title = {
    color: '#fff',
    fontSize: '32px',
    fontWeight: 'bold',
    margin: '0 0 20px',
    textShadow: '0 0 10px rgba(255, 255, 255, 0.3)',
};

const greeting = {
    color: '#fff',
    fontSize: '24px',
    fontWeight: 'bold',
    margin: '0 0 20px',
};

const neonText = {
    color: '#ff00ff',
    textShadow: '0 0 5px rgba(255, 0, 255, 0.5)',
};

const paragraph = {
    color: '#aaa',
    fontSize: '16px',
    lineHeight: '24px',
    margin: '0 0 30px',
};

const linkBox = {
    backgroundColor: 'rgba(255, 0, 255, 0.05)',
    border: '1px solid #ff00ff',
    borderRadius: '8px',
    padding: '30px',
    marginBottom: '30px',
};

const label = {
    color: '#ff00ff',
    fontSize: '12px',
    fontWeight: 'bold',
    letterSpacing: '2px',
    marginBottom: '15px',
};

const linkText = {
    color: '#fff',
    fontSize: '14px',
    fontFamily: 'monospace',
    backgroundColor: '#000',
    padding: '15px',
    borderRadius: '4px',
    marginBottom: '20px',
    wordBreak: 'break-all' as const,
    border: '1px dashed #333',
};

const copyButton = {
    backgroundColor: '#00f3ff',
    borderRadius: '4px',
    color: '#000',
    fontSize: '16px',
    fontWeight: 'bold',
    textDecoration: 'none',
    textAlign: 'center' as const,
    display: 'inline-block',
    padding: '12px 30px',
    textTransform: 'uppercase' as const,
    boxShadow: '0 0 15px rgba(0, 243, 255, 0.3)',
};

const instructionsBox = {
    backgroundColor: 'rgba(0, 243, 255, 0.05)',
    borderLeft: '4px solid #00f3ff',
    padding: '20px',
    marginBottom: '30px',
    textAlign: 'left' as const,
};

const instructionTitle = {
    color: '#00f3ff',
    fontSize: '14px',
    fontWeight: 'bold',
    marginBottom: '10px',
};

const instructionText = {
    color: '#ccc',
    fontSize: '14px',
    margin: '5px 0',
    lineHeight: '20px',
};

const link = {
    color: '#00f3ff',
    textDecoration: 'underline',
};

const hr = {
    borderColor: '#222',
    margin: '0',
};

const footer = {
    backgroundColor: '#000',
    color: '#444',
    fontSize: '12px',
    textAlign: 'center' as const,
    padding: '20px',
};

export default ParsecEmail;
