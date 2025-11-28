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
    Column,
    Row,
} from '@react-email/components';

interface PurchaseEmailProps {
    userName: string;
    productName: string;
    amount: number;
    minutes: number;
    purchaseId: string;
    date: string;
}

export const PurchaseEmail = ({
    userName,
    productName,
    amount,
    minutes,
    purchaseId,
    date,
}: PurchaseEmailProps) => (
    <Html>
        <Head />
        <Preview>¡Compra Exitosa! 💎 Has recargado créditos en Warpzone</Preview>
        <Body style={main}>
            <Container style={container}>
                {/* Header Logo Area */}
                <Section style={headerSection}>
                    <Heading style={logoText}>WARPZONE</Heading>
                    <Text style={subLogoText}>REMOTE GAMING SYSTEMS</Text>
                </Section>

                {/* Main Content */}
                <Section style={contentSection}>
                    <Heading style={title}>¡RECARGA EXITOSA!</Heading>
                    <Text style={greeting}>HOLA <span style={neonText}>{userName.toUpperCase()}</span>,</Text>
                    <Text style={paragraph}>
                        Tus créditos han sido agregados correctamente a tu cuenta. Ya estás listo para jugar.
                    </Text>

                    {/* Purchase Details Card */}
                    <Section style={card}>
                        <Row style={cardRow}>
                            <Column>
                                <Text style={label}>PRODUCTO</Text>
                                <Text style={value}>{productName}</Text>
                            </Column>
                            <Column>
                                <Text style={label}>CRÉDITOS</Text>
                                <Text style={valueHighlight}>+{minutes / 60} HRS</Text>
                            </Column>
                        </Row>
                        <Row style={cardRow}>
                            <Column>
                                <Text style={label}>MONTO</Text>
                                <Text style={value}>${amount.toLocaleString('es-CL')}</Text>
                            </Column>
                            <Column>
                                <Text style={label}>FECHA</Text>
                                <Text style={value}>{date}</Text>
                            </Column>
                        </Row>
                        <Row style={cardRow}>
                            <Column>
                                <Text style={label}>ID TRANSACCIÓN</Text>
                                <Text style={valueId}>#{purchaseId.slice(0, 8)}</Text>
                            </Column>
                        </Row>
                    </Section>

                    <Button style={button} href="https://warpzone.cl/dashboard">
                        IR AL DASHBOARD
                    </Button>
                </Section>

                <Hr style={hr} />

                <Text style={footer}>
                    WARPZONE CHILE<br />
                    Santiago, Región Metropolitana
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
    fontSize: '28px',
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

const card = {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid #333',
    borderRadius: '8px',
    padding: '20px',
    marginBottom: '30px',
    textAlign: 'left' as const,
};

const cardRow = {
    marginBottom: '15px',
};

const label = {
    color: '#666',
    fontSize: '10px',
    fontWeight: 'bold',
    letterSpacing: '1px',
    marginBottom: '5px',
};

const value = {
    color: '#fff',
    fontSize: '18px',
    fontWeight: 'bold',
};

const valueHighlight = {
    color: '#00f3ff',
    fontSize: '18px',
    fontWeight: 'bold',
    textShadow: '0 0 5px rgba(0, 243, 255, 0.3)',
};

const valueId = {
    color: '#666',
    fontSize: '14px',
    fontFamily: 'monospace',
};

const button = {
    backgroundColor: '#ff00ff',
    borderRadius: '4px',
    color: '#000',
    fontSize: '16px',
    fontWeight: 'bold',
    textDecoration: 'none',
    textAlign: 'center' as const,
    display: 'block',
    width: '100%',
    padding: '16px 0',
    textTransform: 'uppercase' as const,
    letterSpacing: '1px',
    boxShadow: '0 0 15px rgba(255, 0, 255, 0.3)',
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

export default PurchaseEmail;
