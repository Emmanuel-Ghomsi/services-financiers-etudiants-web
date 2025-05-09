'use client';

import type React from 'react';
import { useEffect, useState, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';

interface WebSocketProviderProps {
  children: React.ReactNode;
}

// Modifier le WebSocketProvider pour éviter les boucles infinies
export function WebSocketProvider({ children }: WebSocketProviderProps) {
  const { data: session } = useSession();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const socketRef = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const sessionToken = session?.accessToken;

  useEffect(() => {
    // Ne pas se connecter si l'utilisateur n'est pas authentifié
    if (!sessionToken) {
      return;
    }

    // Ne pas créer une nouvelle connexion si elle existe déjà
    if (
      socketRef.current &&
      (socketRef.current.readyState === WebSocket.OPEN ||
        socketRef.current.readyState === WebSocket.CONNECTING)
    ) {
      return;
    }

    // Créer une connexion WebSocket
    const wsUrl = `${process.env.NEXT_PUBLIC_API_PATH_URL?.replace(
      'http',
      'ws'
    )}/ws?token=${sessionToken}`;
    const ws = new WebSocket(wsUrl);
    socketRef.current = ws;

    // Gérer les événements WebSocket
    ws.onopen = () => {
      console.log('WebSocket connecté');
      setIsConnected(true);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        // Si c'est une notification
        if (data.type === 'notification') {
          // Afficher une notification toast
          toast({
            title: 'Nouvelle notification',
            description: data.message,
          });

          // Invalider la requête de notifications pour forcer un rafraîchissement
          queryClient.invalidateQueries({ queryKey: ['notifications'] });
        }

        // Si c'est une mise à jour de fiche client
        if (data.type === 'client_file_update') {
          // Invalider la requête de fiches clients pour forcer un rafraîchissement
          queryClient.invalidateQueries({ queryKey: ['clientFiles'] });

          // Afficher une notification toast
          toast({
            title: 'Mise à jour de fiche client',
            description: data.message,
          });
        }
      } catch (error) {
        console.error('Erreur lors du traitement du message WebSocket:', error);
      }
    };

    ws.onerror = (error) => {
      console.error('Erreur WebSocket:', error);
      setIsConnected(false);
    };

    ws.onclose = () => {
      console.log('WebSocket déconnecté');
      setIsConnected(false);
    };

    // Nettoyer la connexion WebSocket lors du démontage du composant
    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
      socketRef.current = null;
    };
  }, [sessionToken]); // Dépendance uniquement sur le token d'accès

  return <>{children}</>;
}
