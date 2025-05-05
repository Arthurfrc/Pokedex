import React, { createContext, useState, useContext, ReactNode } from "react";
import { Team, TeamMember, Pokemon } from "@/types/Pokemon";

interface TeamContextType {
    teams: Team[];
    currentTeam: Team | null;
    addTeam: (name: string) => void;
    setCurrentTeam: (teamId: string) => void;
    addPokemonToTeam: (pokemon: Pokemon) => void;
    removePokemonFromTeam: (index: number) => void;
    updateTeamMember: (index: number, member: TeamMember) => void;
    deleteTeam: (teamId: string) => void;
    saveTeam: () => void;
}

const TeamContext = createContext<TeamContextType | undefined>(undefined);

export const TeamProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [teams, setTeams] = useState<Team[]>([]);
    const [currentTeam, setCurrentTeamState] = useState<Team | null>(null);

    const addTeam = (name: string) => {
        const newTeam: Team = {
            id: Date.now().toString(),
            name,
            members: [],
        };
        setTeams([...teams, newTeam]);
        setCurrentTeamState(newTeam);
    };

    const setCurrentTeam = (teamId: string) => {
        const team = teams.find(t => t.id === teamId) || null;
        setCurrentTeamState(team);
    };

    const addPokemonToTeam = (pokemon: Pokemon) => {
        if (!currentTeam) return;
        if (currentTeam.members.length >= 6) return;

        const newMember: TeamMember = {
            pokemon,
            selectedForm: 'normal',
            moves: [],
        };

        const updatedTeam = {
            ...currentTeam,
            members: [...currentTeam.members, newMember],
        };

        updateTeams(updatedTeam);
        setCurrentTeamState(updatedTeam);
    };

    const removePokemonFromTeam = (index: number) => {
        if (!currentTeam) return;

        const updatedMembers = [...currentTeam.members];
        updatedMembers.splice(index, 1);

        const updatedTeam = {
            ...currentTeam,
            members: updatedMembers,
        };

        updateTeams(updatedTeam);
        setCurrentTeamState(updatedTeam);
    };

    const updateTeamMember = (index: number, member: TeamMember) => {
        if (!currentTeam) return;

        const updatedMembers = [...currentTeam.members];
        updatedMembers[index] = member;

        const updatedTeam = {
            ...currentTeam,
            members: updatedMembers,
        };

        updateTeams(updatedTeam);
        setCurrentTeamState(updatedTeam);
    };

    const updateTeams = (updatedTeam: Team) => {
        setTeams(teams.map(team =>
            team.id === updatedTeam.id ? updatedTeam : team
        ));
    };

    const saveTeam = () => {
        // Aqui poderia ter uma lógica para salvar na AsyncStorage
        console.log('Time salvo:', currentTeam);
    };

    const deleteTeam = (teamId: string) => {
        setTeams(teams.filter(team => team.id !== teamId));
        if (currentTeam?.id === teamId) { setCurrentTeamState(null); }
    };

    return (
        <TeamContext.Provider
            value={{
                teams,
                currentTeam,
                addTeam,
                setCurrentTeam,
                addPokemonToTeam,
                removePokemonFromTeam,
                updateTeamMember,
                saveTeam,
                deleteTeam,
            }}
        >
            {children}
        </TeamContext.Provider>
    );
};

export const useTeam = (): TeamContextType => {
    const context = useContext(TeamContext);
    if (context === undefined) {
        throw new Error('useTeam must be used within a TeamProvider');
    }
    return context;
};
