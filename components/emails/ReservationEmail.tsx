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

interface ReservationEmailProps {
    userName: string;
    pcName: string;
    date: string;
    time: string;
    reservationId: string;
}

export const ReservationEmail = ({
    userName,
    pcName,
    date,
    time,
    reservationId,
}: ReservationEmailProps) => (
    <Html>
        <Head />
        <Preview>¡Tu reserva en Warpzone está confirmada!</Preview>
        <Body style={main}>
            <Container style={container}>
                <Heading style={h1}>WARPZONE</Heading>
                <Text style={text}>Hola <span style={highlight}>{userName}</span>,</Text>
                <Text style={text}>
                    Tu reserva ha sido confirmada exitosamente. Prepárate para la mejor experiencia de gaming remoto.
                </Text>

                <Section style={box}>
                    <Text style={paragraph}><strong>ID Reserva:</strong> {reservationId}</Text>
                    <Text style={paragraph}><strong>PC:</strong> {pcName}</Text>
                    <Text style={paragraph}><strong>Fecha:</strong> {date}</Text>
                    <Text style={paragraph}><strong>Hora:</strong> {time}</Text>
                </Section>

                <Text style={text}>
                    Recibirás un nuevo correo 5 minutos antes de tu hora con el link de conexión a <strong>Parsec</strong>.
                </Text>

                <Button style={button} href="https://warpzone.cl/dashboard">
                    Ver en Mi Cuenta
                </Button>

                <Hr style={hr} />
                <Text style={footer}>
                    Warpzone Remote Gaming Systems<br />
                    Santiago, Chile
                </Text>
            </Container>
        </Body>
    </Html>
);

const main = {
    backgroundColor: '#000000',
    fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
    padding: '40px 0',
};

const container = {
    backgroundColor: '#111111',
    border: '1px solid #333',
    borderRadius: '8px',
    padding: '40px',
    maxWidth: '600px',
    margin: '0 auto',
};

const h1 = {
    color: '#00f3ff', // Neon Cyan
    fontSize: '32px',
    fontWeight: 'bold',
    textAlign: 'center' as const,
    margin: '0 0 30px',
    letterSpacing: '4px',
};

const text = {
    color: '#cccccc',
    fontSize: '16px',
    lineHeight: '24px',
    textAlign: 'left' as const,
};

const highlight = {
    color: '#ff00ff', // Neon Magenta
    fontWeight: 'bold',
};

const box = {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid #333',
    borderRadius: '4px',
    padding: '20px',
    margin: '20px 0',
};

const paragraph = {
    color: '#ffffff',
    fontSize: '14px',
    lineHeight: '24px',
    margin: '5px 0',
};

const button = {
    backgroundColor: '#00f3ff',
    borderRadius: '4px',
    color: '#000000',
    fontSize: '16px',
    fontWeight: 'bold',
    textDecoration: 'none',
    textAlign: 'center' as const,
    display: 'block',
    width: '100%',
    padding: '12px',
    marginTop: '30px',
};

const hr = {
    borderColor: '#333',
    margin: '30px 0',
};

const footer = {
    color: '#666666',
    fontSize: '12px',
    textAlign: 'center' as const,
};

export default ReservationEmail;
